import mongoose from 'mongoose';

const connect = async () => {
  if (mongoose.connections[0].readyState) return;
  // Use the same URI from your .env
  await mongoose.connect(process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/base_wallet");
  console.log("Frontend API connected to DB");
};

export default connect;