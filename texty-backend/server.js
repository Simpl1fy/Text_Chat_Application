const express = require('express');
const http = require('http');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./database/db');
const cors = require('cors');
const setUpWebSocket = require('./websocket/webSocketConnection');

const app = express();

const corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

// cors middleware
app.use(cors(corsOptions));

// body parser
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send('Text Chat Application using react and express using Mongodb')
})

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

const server = http.createServer(app);
setUpWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})