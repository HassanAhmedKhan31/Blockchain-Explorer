import dbConnect from "./db.js";
import mongoose from "mongoose";
const { base58Decode } = require("../../../base_wallet_backend-main/util/util.js");

const unspentSchema = mongoose.models.Unspent || mongoose.model("Unspent", new mongoose.Schema({
  Transaction: Array,
  TxCount: Number,
  Accountbal: Number
}));

export default async function fetchAccount(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Database connection failed" });
  }

  const account = req.query.account;
  if (!account) return res.status(400).json({ error: "Account is required" });

  const publicKeyHash = base58Decode(account);
  const Inputs = [];
  let Accountbal = 0;

  const cursor = unspentSchema
    .find({
      "Transaction.tx_outs.scriptPubKey.cmds.2": Buffer.from(
        publicKeyHash,
        "hex"
      ),
    })
    .cursor();

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    doc.Transaction.forEach((tx) => {
      tx.tx_outs.forEach((txOut) => {
        if (txOut.scriptPubKey.cmds && txOut.scriptPubKey.cmds[2]) {
          const temp = Buffer.from(txOut.scriptPubKey.cmds[2], 'base64').toString("hex");
          if (temp === publicKeyHash) {
            Accountbal += parseInt(txOut.amount);
            Inputs.push(tx);
          }
        }
      });
    });
  }
  // cursor.close(); // cursor.next() handles closing when null is returned in some drivers, but good to be safe if it's available.

  res.status(200).json({ data: Inputs, Accountbal, TxCount: Inputs.length });
}
