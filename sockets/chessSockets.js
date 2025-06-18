const { Chess } = require("chess.js");
const Room = require("../Models/roomModel");

const socketController = (io) => {
  const players = {}; // Keeps track of players in each room and their game states

  io.on("connection", (socket) => {
    "A player connected:", socket.id;
    let intentionalDisconnect = false; // Flag to track intentional disconnection

    // Joining a room
    socket.on("join", async ({ id, userId }) => {
      socket.join(id);
      `Player ${userId} joined room ${id}`;

      // Initialize the room if it doesn't exist
      if (!players[id]) {
        players[id] = { chess: new Chess(), sockets: [] };
      }

      players[id].sockets.push({ socketId: socket.id, userId });

      // When two players join, start the gameX
      if (players[id].sockets.length === 2) {
        io.to(id).emit("canPlay"); // Notify both players that they can start playing

        // Assign colors and notify each player
        players[id].currentPlayer = players[id].sockets[0];
        io.to(players[id].sockets[0].socketId).emit("gameStart", "w");
        io.to(players[id].sockets[1].socketId).emit("gameStart", "b");
      }
    });

    socket.on("requestSync", ({ roomId }) => {
      const room = players[roomId];
      if (room) {
        io.to(socket.id).emit("syncBoard", room.chess.fen());
      }
    });

    // Handling moves
    socket.on("move", ({ from, to, promotion, roomId }) => {
      const room = players[roomId];
      if (room) {
        const move = room.chess.move({ from, to, promotion });
        if (move) {
          io.to(roomId).emit("move", move);
          if (room.chess.isCheckmate()) {
            io.to(roomId).emit(
              "gameOver",
              `Checkmate! ${move.color === "w" ? "White" : "Black"} wins!`
            );
            delete players[roomId];
          } else if (room.chess.isDraw()) {
            io.to(roomId).emit("gameOver", "Draw!");
            delete players[roomId];
          }
        } else {
          console.warn("Invalid move received:", { from, to, promotion });
        }
      }
    });

    // Restarting the game
    socket.on("restartGame", ({ roomId }) => {
      if (players[roomId]) {
        players[roomId].chess = new Chess(); // Reset the game board
        io.to(roomId).emit("gameRestarted"); // Notify players of restart
      }
    });

    // Leaving the room with an optional intentional flag
    socket.on("leavingRoom", ({ intentional }) => {
      ("shghdshygdhygb");

      intentionalDisconnect = intentional;
    });

    // Disconnecting a player
    socket.on("disconnect", () => {
      setTimeout(() => {
        if (!socket.connected && !intentionalDisconnect) {
          for (const roomId in players) {
            const room = players[roomId];
            const playerIndex = room.sockets.findIndex(
              (p) => p.socketId === socket.id
            );
            if (playerIndex !== -1) {
              room.sockets.splice(playerIndex, 1);
              io.to(roomId).emit("playerLeft", {
                message: "Your opponent left the game.",
              });
              delete players[roomId];
              break;
            }
          }
        }
      }, 5000);
    });

    // Chat functionality: sending a message
    socket.on("sendMessage", ({ value, id, sender }) => {
      ("message");

      socket.to(id).emit("sendMessageReceived", { value, sender });
    });

    // Typing indicator: notifying other player when typing starts
    socket.on("typing", ({ id }) => {
      ("typing recieved");
      id;
      socket.to(id).emit("typingReceived");
    });

    // Typing indicator: notifying other player when typing stops
    socket.on("stopTyping", (id) => {
      socket.to(id).emit("stopTypingReceived");
    });
  });
};

module.exports = socketController;
