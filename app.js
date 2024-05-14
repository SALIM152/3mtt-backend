const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("./logging/logger");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

// app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/signup", require("./routes/signup"));
app.use("/signin", require("./routes/signin"));
app.use("/api/blogs", require("./routes/api/blogs"));
app.use("/api/blogs/owner", require("./routes/api/blogs"));

app.listen(process.env.PORT, () => {
  logger.info(`Server listening at http://localhost:${process.env.PORT}`);
});
