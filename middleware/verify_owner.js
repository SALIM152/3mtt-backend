const User = require("../model/user");

const verify_owner = async (req, res, next) => {
  if (!req?.username) return !res.status(401).json({ message: "unauthorized" });

  const foundUser = await User.findOne({
    first_name: req.username.split(" ")[0],
    last_name: req.username.split(" ")[1],
  }).exec();

  if (!foundUser) return !res.status(401).json({ message: "unauthorized" });

  if (req.username != foundUser.first_name + " " + foundUser.last_name)
    return !res.status(401).json({ message: "unauthorized" });
  next();
};

module.exports = verify_owner;
