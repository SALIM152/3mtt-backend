const mongoose = require("mongoose");
const logger = require("../logging/logger");
require("dotenv").config();

function connectDB() {
  mongoose.connect(process.env.DATABASE_URL);

  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.info(`Error connecting to MongoDB: ${err}`);
  });
}

module.exports = connectDB;
