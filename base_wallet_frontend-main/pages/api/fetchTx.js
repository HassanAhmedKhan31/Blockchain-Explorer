import dbConnect from "./db.js";
import mongoose from "mongoose";

// Use a local schema to avoid importing from backend node_modules during frontend build
const BlockSchema = new mongoose.Schema({
  Height: Number,
  BlockSize: String,
  TxCount: Number,
  Transactions: Array,
  blockHeader: Object
});
const Block = mongoose.models.Block || mongoose.model("Block", BlockSchema);

export default async function fetchTx(req, res) {
  const TxId = req.query.TxId;
  await dbConnect();
  const txData = await Block.find({ "Transactions.TxId": TxId });
  res.status(200).json(txData);
}
