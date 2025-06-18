

const Room=require("../Models/roomModel");

 const socketController = (io) => {
  const players = {};
  io.on("connection", (socket) => {
    let intentionalDisconnect = false;
    socket.on("join", async ({ id, playerId }) => {
       (socket.id + "joined");
      socket.join(id);
      const room = await Room.findOne({ uId: id });
      if (!players[id]) {
        players[id] = [];
      }
      players[id].push({ socketId: socket.id, playerId });
      if (room && room.Users.length === 2) {
        io.to(id).emit("canPlay");
         ("2 PLAYERS JOINED");
      }
    });

    socket.on("squareClicked", ({ n, roomId, value }) => {
       ("clicked square");
      //   (n, roomId, value);
      socket.to(roomId).emit("squareClickedRecieved", { n, w: value });
    });

    socket.on("resetRoom", () => {
       ("resetting room");
      io.emit("resetRoom");
    });

    socket.on("restartGame", ({ n, value, roomId }) => {
       ("restarting game");
      io.to(roomId).emit("restartGameRecieved", { n, w: value });
    });

    socket.on("leavingRoom", ({ intentional }) => {
       ("leaving room");

      intentionalDisconnect = intentional;
    });

    socket.on("offer", (data) => {
      (data.target);
     
      socket.to(data.target).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(data.target).emit("answer", data);
    });

    socket.on("iceCandidate", (data) => {
      socket.to(data.target).emit("iceCandidate", data);
    });


    socket.on("disconnect", () => {
      setTimeout(() => {
        if (!socket.connected && !intentionalDisconnect) {
           (socket.id + "disconnected");
          for (const roomId in players) {
            const playerIndex = players[roomId].findIndex(
              (p) => p.socketId === socket.id
            );
            if (playerIndex !== -1) {
              const [disconnectedPlayer] = players[roomId].splice(
                playerIndex,
                1
              );

              io.to(roomId).emit("playerLeft", {
                message: `${disconnectedPlayer.playerId} has left the game.`,
              });

              if (players[roomId].length === 0) {
                delete players[roomId];
              }

              break;
            }
          }

          // const rooms = io.of("/").adapter.rooms;
          //  (rooms);

          // const set=rooms.has(socket.id);
          //  (socket.id);

          // if(set) {
          //   set.forEach(element => {
          //     io.to(element).emit("playerLeft", {
          //       message: `${players[element].playerId} has left the game.`,
          //     });
          //   });
          //   rooms.delete(socket.id);
          // }
        }
      }, 5000);
    });

    socket.on("sendMessage", ({ value, id,sender }) => {
       ("sending message");
       (value, id);
      socket.to(id).emit("sendMessageReceived", { value,sender });
    });

    socket.on("typing", async ({ id }) => {
       ("typing");
      socket.to(id).emit("typingReceived");
    });

    socket.on("stopTyping", async (id) => {
     ("stop typing recieved" + id);
      socket.to(id).emit("stopTypingReceived");
    });
  });
};

   module.exports=socketController
