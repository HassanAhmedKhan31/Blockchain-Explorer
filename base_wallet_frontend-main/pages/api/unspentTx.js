import mongoose from "mongoose";
import bs58 from 'bs58';

// 1. Local Schema Definition to prevent deep-linking into Backend node_modules
const unspentSchema = mongoose.models.Unspent || mongoose.model("Unspent", new mongoose.Schema({
    Transaction: [
        {
            TxId: String,
            tx_ins: Array,
            tx_outs: [
                {
                    amount: Number,
                    scriptPubKey: {
                        cmds: Array,
                    },
                },
            ],
        },
    ],
}));

// 2. Updated Local Utility Logic (Corrected Slicing)
const base58Decode = (address) => {
    const decoded = bs58.decode(address);
    // MUST slice (1, -4) to remove Bitcoin prefix and checksum to match DB hashes
    return Buffer.from(decoded.slice(1, -4)).toString("hex");
};

// 3. Database Connection Utility
const connect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/base_wallet");
};

export default async function fetchUnspentTx(req, res) {
    // 4. Dynamic import to bypass Webpack build-time dependency errors
    const createTransaction = require("../../../base_wallet_backend-main/core/prepareTx");

    try {
        await connect();
    } catch (error) {
        console.error("Database connection error:", error);
        return res.status(500).json({ error: "Database connection failed" });
    }

    const { priv, fromAddress, toAddress, Amount } = req.body;

    let publicKeyHash = "";
    if (fromAddress[0] === "1" && fromAddress.length === 34) {
        publicKeyHash = base58Decode(fromAddress);
    } else {
        publicKeyHash = fromAddress;
    }

    let amount = 0;
    const Inputs = [];
    
    try {
        // Query the DB for UTXOs matching the sender's public key hash
        const cursor = unspentSchema
            .find({
                "Transaction.tx_outs.scriptPubKey.cmds.2": Buffer.from(
                    publicKeyHash,
                    "hex"
                ),
            })
            .cursor();

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            if (amount < Amount) {
                doc.Transaction.forEach((tx) => {
                    let flag = false;
                    tx.tx_outs.forEach((txOut) => {
                        // scriptPubKey.cmds[2] is usually the PubKeyHash in P2PKH
                        const currentCmd = txOut.scriptPubKey.cmds[2].toString("hex");
                        
                        if (amount < Amount) {
                            if (currentCmd === publicKeyHash) {
                                amount += parseInt(txOut.amount);

                                if (!flag) {
                                    flag = true;
                                    Inputs.push(doc.Transaction);
                                }
                            }
                        }
                    });
                });
            } else {
                break;
            }
        }
        
        // Ensure we found enough funds before calling createTransaction
        if (amount < Amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        const TxObj = await createTransaction(priv, toAddress, Amount, Inputs);
        res.status(200).json({ data: TxObj });

    } catch (error) {
        console.error("Transaction Preparation Error:", error);
        res.status(500).json({ error: "Failed to prepare transaction", details: error.message });
    }
}