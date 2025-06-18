const express = require("express");

const app = express();
const connectDb = require("./config/db.js");
const dotenv = require("dotenv");
const tttRouter = require("./routers/tttRouter.js");
const cors = require("cors");
const Room = require("./Models/roomModel.js");
const cookies = require("cookie-parser");
const userRouter = require("./routers/userRouter");
const reqRouter = require("./routers/reqRouter");
const chessRouter = require("./routers/chessRouter");
const path=require("path")

app.use(cookies());
const tttSocketController = require("./sockets/tttSocket")
const chessSocketController = require("./sockets/chessSockets");

 const _dirname=path.resolve();


app.use(
  cors({
     origin: "https://frontend1-h2pg.onrender.com",
    credentials: true,
  })
);

dotenv.config();
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/ttt", tttRouter);
app.use("/api/chess", chessRouter);
app.use("/api/req",reqRouter);




const PORT = process.env.PORT || 5000;

const server=app.listen(PORT);
const { Server } = require("socket.io");
const userModel = require("./Models/userModel.js");
const gamesSocketController = require("./sockets/gamesSocket.js");
const io = new Server(server, {
  cors: {
    origin: "https://frontend1-h2pg.onrender.com",
    credentials: true,
  }
});

const tic=io.of("/ttt")
const chess=io.of("/chess")
gamesSocketController(io);
tttSocketController(tic);
chessSocketController(chess);





