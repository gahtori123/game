const friendRequest = require("../Models/friendRequest");
const userModel = require("../Models/userModel");

const gamesSocketController = (io) => {
  io.on("connection", (socket) => {
    socket.on("join", ({ id }) => {
      ("connected");

      socket.join(id); // Join room based on `id`
    });

    socket.on("addUser", async ({ id, userId }) => {
      try {
        const user = await userModel.findOne({ _id: id });
        ("sent");

        if (user) {
          user.id;

          socket.to(id).emit("requestsent", {
            name: user.name,
            profilepic: user.profilepic,
            id: userId,
          });
        } else {
          console.error("User not found:", id);
        }
      } catch (error) {
        console.error("Error in addUser event:", error);
      }
    });

    socket.on("accepted", async ({ requestId, user }) => {
      try {
        ("accepted");

        // Populate sender field to get full user document
        const request = await friendRequest
          .findById(requestId)
          .populate("sender");

        if (request && request.sender) {
          socket.to(request.sender._id.toString()).emit("requestAccepted", {
            name: user.name,
            pic: user.profilepic,
          });
        } else {
          console.error(
            "Request not found or sender not populated:",
            requestId
          );
        }
      } catch (error) {
        console.error("Error in accepted event:", error);
      }
    });

    socket.on("sendMessage", ({ user, id, gid }) => {
      ("dghygdsyhgvsy");
      id;
      socket.to(id).emit("sendMessageRecieved", { user, gid });
    });
  });
};

module.exports = gamesSocketController;
