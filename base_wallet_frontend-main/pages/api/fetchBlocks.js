import mongoose from "mongoose";

// Define the Schema locally in the API to prevent "Module Not Found" trace errors
// from reaching into the backend node_modules
const BlockSchema = new mongoose.Schema({
  Height: Number,
  BlockSize: Number,
  blockHeader: {
    version: Number,
    prevBlockHash: String,
    merkleroot: String,
    timestamp: Number,
    bits: String,
    nonce: Number,
    blockhash: String,
  },
  TxCount: Number,
  Transactions: Array,
});

// Create the model or use the existing one
const Block = mongoose.models.Block || mongoose.model("Block", BlockSchema);

export default async function fetchBlocks(req, res) {
  // Database Connection
  if (mongoose.connection.readyState === 0) {
    const dbUri = process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/base_wallet";
    try {
      await mongoose.connect(dbUri);
      console.log("Frontend API: Connected to MongoDB");
    } catch (err) {
      return res.status(500).json({ error: "Database connection failed" });
    }
  }

  const PAGE_SIZE = 20;
  const currentBlock = req.query.blockHeight ? parseInt(req.query.blockHeight) : 0;
  const latest = req.query.latest;

  try {
    let blocks;
    // Polling for latest blocks
    if (latest === "1") {
      blocks = await Block.find({ Height: { $gt: currentBlock } })
        .sort({ Height: -1 })
        .limit(PAGE_SIZE);
    } 
    // Initial Load
    else if (currentBlock === 0) {
      blocks = await Block.find({})
        .sort({ Height: -1 })
        .limit(PAGE_SIZE);
    } 
    // Infinite Scroll
    else {
      blocks = await Block.find({ Height: { $lt: currentBlock } })
        .sort({ Height: -1 })
        .limit(PAGE_SIZE);
    }

    return res.status(200).json(blocks);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}