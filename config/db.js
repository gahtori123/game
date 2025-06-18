const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://gahtori0001:yypnMzeKabbMwK2n@cluster0.ps5mcym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    `MongoDB Connected: ${conn.connection.host}`;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
