const express = require("express");
const favicon = require("serve-favicon");
const http = require("http");
require("dotenv").config();
const bodyParser = require("body-parser");
const db = require("../database/db");
const cors = require("cors");
const setUpWebSocket = require("../websocket/webSocketConnection");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// cors middleware
app.use(cors(corsOptions));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// body parser
app.use(bodyParser.json());

app.get("/", (req, res) => {
  try {
    return res
      .status(200)
      .send("Text Chat Application using react and express using Mongodb");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const userRoutes = require("../routes/userRoutes");
app.use("/user", userRoutes);

const chatRoutes = require("../routes/chatRoutes");
app.use("/chat", chatRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: "no route found" });
})

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
})



const server = http.createServer(app);
setUpWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
