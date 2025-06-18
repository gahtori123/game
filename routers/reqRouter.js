const express = require('express');
const { sendRequest, getFriends, rejectRequest, getRequests, acceptRequest } = require('../controllers/reqController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router= express.Router();

router.post("/send",isLoggedIn, sendRequest);
router.post("/accept",isLoggedIn,acceptRequest)
router.post("/reject", isLoggedIn, rejectRequest);
router.get("/getfriends", isLoggedIn, getFriends);
router.get("/getrequests",isLoggedIn, getRequests);

module.exports =router