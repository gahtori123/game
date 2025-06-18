const express = require("express");
const router = express.Router();
const {CreateRoom}=require("../controllers/roomController")
const { JoinRoom } = require("../controllers/roomController");
router.get("/createRoom",CreateRoom);
router.post("/joinRoom", JoinRoom);

module.exports = router;