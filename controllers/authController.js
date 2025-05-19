const jwt = require("jsonwebtoken");
const User = require("../models/User");

// generate JWT Token

const generateToken = (id) => {
  //  "error": "secretOrPrivateKey must have a value"
  // solution append an empty string "" +, wrap the entire env variable with temperal literal strings
  return jwt.sign({ id }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: "1h" });
};

const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  //  validation:check for empty fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // create user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ messge: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding user.", error: error.message });
  }
};

const protect = async (req, res) => {
  res.send("protect route hit");
};

module.exports = { registerUser, loginUser, getUserInfo };
