const express = require('express');
const User = require('../database/Models/user');

const router = express.Router();

router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log(response);
        res.status(200).json({"response": response});
    } catch(err) {
        console.log("An error occured = ", err);
        res.status(500).json({"Error": "Internal Server Error"});
    }
})

module.exports = router;