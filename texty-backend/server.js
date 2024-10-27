const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send('Text Chat Application using react and express using Mongodb')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})