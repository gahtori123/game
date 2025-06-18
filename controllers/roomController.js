const asynchandler = require("express-async-handler");
const shortid = require("shortid");
const Room = require("../Models/roomModel");
const userModel = require("../Models/userModel");

const CreateRoom = asynchandler(async (req, res) => {
  const uniqueId = shortid.generate();
  const room = new Room({
    uId: uniqueId,
  });

  await room
    .save()
    .then(() => {
      ("Room created");
    })
    .catch((err) => {
      console.error(err);
    });
  res.send(uniqueId);
});

const JoinRoom = asynchandler(async (req, res) => {
  const { uId, userId } = req.body;
  const room = await Room.findOne({ uId });

  if (!room) {
    return res.status(404).send("Room not found");
  }

  if (room.Users.length === 2) {
    return res.status(400).send("Room is already full");
  }

  if (room.Users.includes(userId)) {
    return res.status(400).send("You are already in the room");
  }

  room.Users.push(userId);

  try {
    await room.save();
    res.status(200).send("Joined room successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error joining room");
  }
});

module.exports = { CreateRoom, JoinRoom };
