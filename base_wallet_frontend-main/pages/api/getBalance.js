import mongoose from "mongoose";
import bs58 from 'bs58';

const unspentSchema = mongoose.models.Unspent || mongoose.model("Unspent", new mongoose.Schema({
    Transaction: [{
        tx_outs: [{
            amount: Number,
            scriptPubKey: { cmds: Array }
        }]
    }]
}));

const base58Decode = (address) => {
    const decoded = bs58.decode(address);
    return Buffer.from(decoded.slice(1, -4)).toString("hex");
};

const connect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/base_wallet");
};

export default async function handler(req, res) {
    await connect();
    const { address } = req.query;
    if (!address) return res.status(400).json({ error: "Address required" });

    try {
        const publicKeyHash = (address[0] === "1" && address.length === 34) 
            ? base58Decode(address) 
            : address;

        const utxos = await unspentSchema.find({
            "Transaction.tx_outs.scriptPubKey.cmds.2": Buffer.from(publicKeyHash, "hex")
        });

        let totalBalance = 0;
        utxos.forEach(doc => {
            doc.Transaction.forEach(tx => {
                tx.tx_outs.forEach(out => {
                    if (out.scriptPubKey.cmds[2].toString("hex") === publicKeyHash) {
                        totalBalance += out.amount;
                    }
                });
            });
        });

        res.status(200).json({ balance: totalBalance / 100000000 }); // Return in BTC
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}