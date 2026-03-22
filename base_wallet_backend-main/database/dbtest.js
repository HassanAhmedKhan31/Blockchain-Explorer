require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Simplified for modern Mongoose versions
    await mongoose.connect(process.env.MONGODB_URI); 
db.js
    console.log("CONNECTED to MONGODB DATABASE");
    return mongoose;
  } catch (err) {
    console.error("Database connection error:", err);
  }
};
if (require.main === module) {
  connectDB();
}

module.exports = connectDB;
