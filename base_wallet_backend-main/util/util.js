const { createHash } = require("crypto");
const bs58 = require("bs58").default;

// Two Rounds of sha256 hash
function sha256Double(data) {
  return createHash("sha256")
    .update(createHash("sha256").update(data).digest())
    .digest();
}

const hash256 = (message) => {
  return createHash("sha256").update(message).digest("hex");
};

const hash160 = (msg) => {
  const sha256 = createHash("sha256").update(msg).digest();
  const PubKeyHash = createHash("ripemd160").update(sha256).digest();
  return PubKeyHash;
};

// Base58 encode
function base58Encode(data) {
  return bs58.encode(data);
}

/**
 * UPDATED: Base58 decode logic
 * Properly handles Base58Check by removing the 1-byte prefix (0x00)
 * and the 4-byte checksum from the end.
 */
function base58Decode(data) {
  const decoded = bs58.decode(data);
  // Convert to Buffer to use slice and toString('hex')
  // Slicing (1, -4) removes the prefix and the checksum
  return Buffer.from(decoded.slice(1, -4)).toString("hex");
}

// generate Address from PublicKeyHash
function generateAddress(publicKeyHash) {
  const prefix = Buffer.from([0x00]);
  const publicKeyHashWithCheckSum = Buffer.concat([prefix, publicKeyHash]);
  const checkSum = sha256Double(publicKeyHashWithCheckSum).slice(0, 4);
  const publicKeyHashWithCheckSumAndCheckSum = Buffer.concat([
    publicKeyHashWithCheckSum,
    checkSum,
  ]);
  return base58Encode(publicKeyHashWithCheckSumAndCheckSum);
}

// Create merkle root
function createMerkleRoot(transactions) {
  let merkleTree = [];
  for (const tx of transactions) {
    merkleTree.push(Buffer.from(tx.TxId, "hex").reverse());
  }
  while (merkleTree.length > 1) {
    const nextTree = [];
    if (merkleTree.length % 2 === 1) {
      merkleTree.push(merkleTree[merkleTree.length - 1]);
    }
    for (let i = 0; i < merkleTree.length; i += 2) {
      const left = merkleTree[i];
      const right = merkleTree[i + 1];
      const data = Buffer.concat([left, right]);
      const hash = sha256Double(data);
      nextTree.push(hash);
    }

    merkleTree = nextTree;
  }
  return merkleTree[0].reverse().toString("hex");
}

function bytesNeeded(n) {
  if (n === 0) {
    return 1;
  }
  return parseInt(Math.log(parseInt(n)) / Math.log(256) + 1);
}

// bigIntToLittleEndian
function intToLittleEndian(num, byteSize) {
  return bigIntToBuffer(num, byteSize).reverse();
}

// littleEndianToInt
function littleEndianToInt(buf) {
  return bufferToBigInt(buf.reverse());
}

function bits_to_target(bits) {
  const exp = bits.slice(-1);
  const mantissa = bits.slice(0, -1);
  const coff = littleEndianToInt(mantissa);
  return coff * 256n ** (BigInt(exp[0]) - 3n);
}

// target to bits
function target_to_bits(target) {
  let rawBytes = bigIntToBuffer(target, 32);
  // remove leading zeros
  while (rawBytes[0] === 0) {
    rawBytes = rawBytes.slice(1);
  }
  let exponent = "";
  let coefficient = "";
  if (rawBytes[0] > 0x7f) {
    exponent = rawBytes.length + 1;
    coefficient = Buffer.concat([Buffer.from([0x00]), rawBytes.slice(0, 2)]);
  } else {
    exponent = rawBytes.length;
    coefficient = rawBytes.slice(0, 3);
  }
  const newBits = Buffer.concat([
    coefficient.reverse(),
    Buffer.from([exponent]),
  ]);
  return newBits;
}

function bigIntToBuffer(bn, byteSize = null) {
  if (byteSize === null) {
    const buf = Buffer.from(bn.toString(16), "hex");
    return buf;
  } else {
    let zeroPadding = byteSize - bytesNeeded(bn);
    let zeroString;

    if (bn.toString(16).length % 2) {
      bn = "0" + bn.toString(16);
    }

    if (zeroPadding > 0) {
      zeroString = "0".repeat(zeroPadding * 2);
      return Buffer.from(zeroString + bn.toString(16), "hex");
    } else {
      return Buffer.from(bn.toString(16), "hex");
    }
  }
}

function bufferToBigInt(buf) {
  if (!buf instanceof Buffer) {
    return Buffer.from(buf.toString("binary"));
  }
  return BigInt("0x" + buf.toString("hex"));
}

//encodeVarint
function encodeVarint(i) {
  if (i < 0xfd) {
    return Buffer.from([i]);
  } else if (i < 0x10000) {
    return Buffer.from([Buffer.from[0xfd], intToLittleEndian(i, 2)]);
  } else if (i < 0x100000000) {
    return Buffer.from([Buffer.from[0xfe], intToLittleEndian(i, 4)]);
  } else if (i < 0x10000000000000000) {
    return Buffer.from([Buffer.from[0xff], intToLittleEndian(i, 8)]);
  } else {
    throw new Error("Number too big");
  }
}

module.exports = {
  sha256Double,
  base58Encode,
  base58Decode,
  intToLittleEndian,
  littleEndianToInt,
  bytesNeeded,
  encodeVarint,
  bigIntToBuffer,
  bufferToBigInt,
  hash256,
  hash160,
  generateAddress,
  createMerkleRoot,
  bits_to_target,
  target_to_bits,
};