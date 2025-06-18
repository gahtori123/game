const asynchandler = require("express-async-handler");
const userModel = require("../Models/userModel");

const jwt = require("jsonwebtoken");

const isLoggedIn = asynchandler(async (req, res, next) => {
  const token = req.cookies.token;
  //   (token);

  if (!token) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  try {
    const decoded = jwt.verify(token, "ayush");
    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    // (user);
    req.user = user;
    //  (req.user);
    next();
  } catch (err) {
    err;
    return res.status(401).json({ message: "You are not logged in" });
  }
});

module.exports = isLoggedIn;
