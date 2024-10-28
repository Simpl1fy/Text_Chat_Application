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

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});

        if(!user) {
            return res.status(401).json({"error": "invalid email"});
        }
        if(!(await user.comparePassword(password))) {
            return res.status(401).json({"error": "wrong password"});
        }
        res.status(200).json({"user": user});
    } catch(err) {
        console.log(err);
        res.status(500).json({"error": "Internal server error"});
    }
})

module.exports = router;