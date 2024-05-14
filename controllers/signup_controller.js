const User = require("../model/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const getUser = async (req) => {
  const user = await User.findOne({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  }).exec();

  return user;
};

const signUpUser = async (req, res) => {
  const fname = req.body.first_name;
  const lname = req.body.last_name;
  const email = req.body.email;
  const pwd = req.body.password;
  //const { fname, lname, email, pwd } = req.body;
  if (!fname || !lname)
    return res
      .status(400)
      .json({ message: "First and last name are required" });

  if (!email) return res.status(400).json({ message: "email is required" });

  if (!pwd) return res.status(400).json({ message: "password is required" });

  const duplicateUser = await getUser(req);

  if (duplicateUser)
    return res
      .status(403)
      .json({ message: "user alread exist, try signing in" });

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      first_name: fname,
      last_name: lname,
      email: email,
      password: hashedPwd,
    });

    res.status(201).json(result);
  } catch (err) {
    logger.error(err);
  }
};

module.exports = signUpUser;
