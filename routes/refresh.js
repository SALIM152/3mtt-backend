const express = require("express");
const handleRefreshToken = require("../controllers/refreshtoken_controller");

const refreshTokenRouter = express.Router();

refreshTokenRouter.get("/", handleRefreshToken);

module.exports = refreshTokenRouter;
