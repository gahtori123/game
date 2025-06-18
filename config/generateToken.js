const jwt = require("jsonwebtoken");

 const generateToken =({id,email})=>{
  return jwt.sign({id,email},"ayush")

 }

 module.exports = generateToken;