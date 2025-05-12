const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Mongo Connected ${conn.connection.host} : ${conn.connection.port}`
    );
  } catch (error) {
    console.error("Error", error.message);
    process.exit(1);
  }
};

module.exports =connectDb