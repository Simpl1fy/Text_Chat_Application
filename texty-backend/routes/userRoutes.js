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
});

router.post('/add_contact', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.jwtPayload;
        const data = req.body;
        const contactId = data.contactId;
        console.log(userData);
        console.log(contactId);
        
        // Checking if the contact id is present in the req body
        if(!data) {
            return res.status(401).json({"error": "Contact Id is required"})
        }
        const user = await User.findById(userData.id);
        
        // checking if the user exists by the user id
        if(!user) {
            return res.status(401).json({"error": "User does not exist"});
        }

        // checking if the contact already exists
        if(user.contacts.includes(contactId)) {
            return res.status(401).json({"error": "contact already exists"});
        }

        // If all the edge cases are checked we add the contact
        user.contacts.push(contactId);
        await user.save();


        return res.status(200).json({"message": "Contact Added Succesfully", "contacts": user.contacts});
    } catch(err) {
        console.log("An error occured = ", err );
        res.status(500).json({"error": "Internal Server Error"});
    } 
});

router.get('/contacts', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.jwtPayload; // Assuming jwtAuthMiddleware attaches userId to req

        // Find user and populate contacts
        const user = await User.findById(userData.id).populate('contacts', 'name email');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return populated contacts
        res.status(200).json(user.contacts);
    } catch (err) {
        console.error('An error occurred:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;