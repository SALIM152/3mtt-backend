const express = require("express");
const signInUser = require("../controllers/signin_controller");

const signInRouter = express.Router();

signInRouter.post("/", signInUser);

module.exports = signInRouter;
