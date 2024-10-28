const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.LOCAL_MONGODB_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection; // use to connect nodejs to mongodb

db.on("connected", () => {
    console.log("Connected to mongo database");
})

db.on("error", (err)=> {
    console.log("There was a error: " + err);
})

db.on("disconnected", () => {
    console.log("Disconnected from the server");
})

module.exports = db;