const asynchandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const friendRequest = require("../Models/friendRequest");


// for sending requests - for using in navbar left side
const sendRequest = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { recieverId } = req.body;
  if (!recieverId) {
    return res
      .status(400)
      .json({ message: "Please provide the receiver's id" });
  }

  const reciever = await userModel.findById(recieverId);
  if (!reciever) {
    return res.status(404).json({ message: "Receiver not found" });
  }

  // Check for existing friend requests
  const existingRequest = await friendRequest.findOne({
    sender: user._id,
    reciever: reciever._id,
  });
  // if (existingRequest) {
  //   return res.status(400).json({ message: "Friend request already sent" });
  // }

  // Create new friend request
  const request = await friendRequest.create({
    reciever: reciever._id,
    sender: user._id,
    status: "pending",
  });

  // Update receiver's Requests
  reciever.Requests.push(request._id); // Push the ID of the request
  await reciever.save();

  // (reciever.Requests);
  // ("Successfully sent");

  return res.status(200).json({ message: "Friend request sent successfully" });
});

// for getting friend list use in ttthome
const getFriends = asynchandler(async (req, res) => {
  const user = req.user;
  // (user);

  if (!user) {
    throw new Error("User not found");
  }

  const friends = [];
  for (let id of user.friends) {
    const friend = await userModel.findById(id);
    let user = {
      _id: friend._id,
      name: friend.name,
      email: friend.email,
      pic: friend.profilepic,
    };
    friends.push(user);
  }
  // (friends);
  // (friends);
  res.status(200).send(friends);
});

// for accepting friendrequest -used at friendrequestlist left

const acceptRequest = asynchandler(async (req, res) => {
  const user = req.user; // Current logged-in user (should be the receiver)

  if (!user) throw new Error("User not found");

  const { requestId } = req.body;
  if (!requestId) throw new Error("Please provide the request id");

  const request = await friendRequest.findById(requestId);
  if (!request) throw new Error("Request not found");

  // Verify that the request is indeed pending
  if (request.status !== "pending") throw new Error("Invalid request status");

  // Find the sender and update their friends list
  const sender = await userModel.findOneAndUpdate(
    { _id: request.sender },
    { $push: { friends: user._id }, $pull: { Requests: requestId } }, // Remove request from sender's Requests
    { new: true }
  );

  if (!sender) throw new Error("Sender not found");

  // Update receiver's (current user) friends list
  await userModel.findOneAndUpdate(
    { _id: request.reciever },
    { $push: { friends: sender._id } },
    { new: true }
  );

  // Update the status of the friend request
  request.status = "accepted";
  await request.save();

  ("AcceptedRequest");

  res.status(200).send("Request is accepted");
});

// for rejecting friendrequest -used at friendrequestlist right

const rejectRequest = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new Error("User not found");

  const { requestId } = req.body;
  if (!requestId) throw new Error("Please provide the request id");

  const request = await friendRequest.findById(requestId);
  if (!request) throw new Error("Request not found");

  // const reciever = await userModel.findById(request.reciever);
  // if (!reciever) throw new Error("Reciever not found");
  if (request.status !== "pending") throw new Error("Invalid request status");
  request.status = "rejected";
  await request.save();
  ("Rejected request");

  res.status(200).send("Request is rejected");
});

// for getting pending friend requests - used at navbar right side
const getRequests = asynchandler(async (req, res) => {
  const user = req.user;
  //  (user);

  if (!user) {
    throw new Error("User not found");
  }
  const penRequests = [];
  // (user.Requests); // Log the entire user object

  for (let req of user.Requests) {
    const request = await friendRequest.findOne({ _id: req });
    if (request.status === "pending") {
      const sender = await userModel
        .findById(request.sender)
        .select("-password -Requests");
      penRequests.push({
        sender,
        requestId: request._id,
      });
    }
  }
  //  (penRequests);

  res.status(200).send(penRequests);
});

module.exports = {
  sendRequest,
  getFriends,
  acceptRequest,
  rejectRequest,
  getRequests,
};
