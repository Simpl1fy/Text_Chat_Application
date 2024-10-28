const express = require('express');
const User = require('../database/Models/user');
const { generateToken, jwtAuthMiddleware} = require('../middleware/jwt');

const router = express.Router();

router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log(response);
        const payload = {
            id: response.id,
            email: response.email
        }
        const token = generateToken(payload);
        console.log("Token has been generated = ", token);  
        res.status(200).json({"response": response, "token": token});
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
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = generateToken(payload);
        console.log("Token has been generated = ", token);
        res.status(200).json({"user": user, "token": token});
    } catch(err) {
        console.log(err);
        res.status(500).json({"error": "Internal server error"});
    }
})

module.exports = router;