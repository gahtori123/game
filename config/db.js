const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(`mongodb://127.0.0.1:27017
/minor`);
    `MongoDB Connected: ${conn.connection.host}`;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDb;
