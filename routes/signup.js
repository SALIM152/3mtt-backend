const express = require("express");
const signUpUser = require("../controllers/signup_controller");

const signUpRouter = express.Router();

signUpRouter.post("/", signUpUser);

module.exports = signUpRouter;
