const asynchandler = require("express-async-handler");
const userModel = require("../Models/userModel.js");
const generateToken = require("../config/generateToken.js");
const bcrypt = require("bcryptjs");

const cookieOptions = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === "production", // Uncomment this in production
  sameSite: "None",
  // maxAge: 3600000, // 1 hour
};

const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!email || !name || !password) {
    throw new Error("Please fill all the fields properly");
  }

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    throw new Error("Email already exists");
  }

  const user = await userModel.create({
    name,
    email,
    password,
    profilepic: pic,
  });

  const token = generateToken({ id: user._id, email: user.email });
  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    name: user.name,
    email: user.email,
    pic: user.profilepic,
    _id: user._id,
  });
});

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please fill all the fields properly");
  }

  const user = await userModel.findOne({ email });
  user;

  matchPassword = async function (enteredPassword, password) {
    return await bcrypt.compare(enteredPassword, password);
  };

  if (!user || !matchPassword(password, user.password)) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({ id: user._id, email: user.email });
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    name: user.name,
    email: user.email,
    pic: user.profilepic,
    _id: user._id,
  });
});

const profile = asynchandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

const logout = asynchandler(async (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  res.status(200).send("Logout successful");
});

const list = asynchandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel.find(keyword);
  res.send(users);
});

module.exports = { registerUser, loginUser, profile, list, logout };
