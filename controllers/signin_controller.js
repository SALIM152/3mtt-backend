const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logging/logger");
require("dotenv").config();

const signInUser = async (req, res) => {
  const fname = req.body.first_name;
  const lname = req.body.last_name;
  const pwd = req.body.password;
  //const { fname, lname, email, pwd } = req.body;
  if (!fname || !lname)
    return res
      .status(400)
      .json({ message: "First and last name are required" });

  if (!pwd) return res.status(400).json({ message: "password is required" });

  const foundUser = await User.findOne({
    first_name: fname,
    last_name: lname,
  }).exec();

  if (!foundUser)
    return res.status(401).json({ message: "user not found, try signing up" });

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const accessToken = jwt.sign(
      { username: fname + " " + lname },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20m" }
    );

    const refreshToken = jwt.sign(
      { username: fname + " " + lname },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    logger.info(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "Incorrect password" });
  }
};

module.exports = signInUser;
