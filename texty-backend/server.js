const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./database/db');

const app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send('Text Chat Application using react and express using Mongodb')
})

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})