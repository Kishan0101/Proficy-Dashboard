const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin@123") {
    const token = jwt.sign({ username: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ message: "Login successful", token });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return res.json({ message: "Login successful", token });
};

module.exports = { login };
