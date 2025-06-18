const express=require("express");
const router=express.Router();

const isLoggedIn = require("../middlewares/isLoggedIn");

const {registerUser,loginUser,profile,logout,list}=require("../controllers/authController");

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/list",isLoggedIn, list);
router.get("/logout",  logout);



module.exports=router