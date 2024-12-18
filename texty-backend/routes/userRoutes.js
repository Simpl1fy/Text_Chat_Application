const express = require('express');
const User = require('../database/Models/user');
const { generateToken, jwtAuthMiddleware} = require('../middleware/jwt');

const router = express.Router();

router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const user = await User.findOne({email: data.email});
        if(user) {
            return res.status(400).json({message: "Email already exists"})
        }
        const newUser = new User(data);
        const response = await newUser.save();
        console.log(response);
        const payload = {
            id: response.id,
            email: response.email
        }
        const token = generateToken(payload);
        console.log("Token has been generated = ", token);  
        res.status(200).json({token: token});
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
            return res.status(404).json({"message": "Given Email is not valid"});
        }
        if(!(await user.comparePassword(password))) {
            return res.status(401).json({"message": "Given Password is incorrect"});
        }
        const payload = {
            id: user.id,
            email: user.email
        }
        const token = generateToken(payload);
        console.log("Token has been generated = ", token);
        res.status(200).json({"token": token});
    } catch(err) {
        console.log(err);
        res.status(500).json({"error": "Internal server error"});
    }
});

// route for creating notification
router.post('/add_contact/create_notification', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.jwtPayload;
        const { receiverId } = req.body;

        // checking if the senderId and the receiverId is the same, if sane then return
        if(userData.id == receiverId) {
            console.log("sender id and receiver id is same");
            return res.status(400).json({
                'success': false,
                'error': "Cannot send request to yourself"
            })
        }

        // error checking - Checking if receiverId is received in the body or not
        if(!receiverId) {
            console.log("ReceiverId not present in body");
            return res.status(400).json({
                'sucess': false,
                'error': 'Receiver id is required'
            });
        }

        // finding the sender
        const sender = await User.findById(userData.id);
        if(!sender) {
            console.log("Sender Id not found");
            return res.status(401).json({
                'success': false,
                "error": "Sender not found"
            });
        }

        

        // finding the receiver
        const receiver = await User.findById(receiverId);
        if(!receiver) {
            console.log("reciever id not found");
            return res.status(401).json({
                'success': false,
                'error': 'Receiver not found'
            });
        }

        // checking if the sender already has the receiverId as contact
        if(sender.contacts.includes(receiverId)) {
            return res.status(200).json({
                'success': false,
                'error': 'Contact already exists'
            });
        }

        // Checking if the receiver already has notification from the sender
        const notificationExists = await User.findOne({
            _id: receiverId,
            notifications: {
                $elemMatch: {
                    userName: sender.name,
                    userEmail: sender.email,
                    userId: sender.id
                }
            }
        })

        // if notification exists we return
        if(notificationExists) {
            return res.status(400).json({
                'success': false,
                "error": "Request already sent"
            });
        }

        // Adding notification
        receiver.notifications.push(
            {
                userName: sender.name,
                userEmail: sender.email,
                userId: sender.id
            }
        )

        // Saving the new document with the notification pushed
        await receiver.save();


        return res.status(200).json({
            'success': true,
            "message": "Notification sent", 
            "notifications": receiver.notifications
        });
    } catch(err) {
        console.log("An error occured =", err);
        return res.status(500).json({"error": "internal server error"});
    }
});

// Creating a route for accepting notification
router.post('/add_contact/accept', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.jwtPayload;
        const { senderId } = req.body;

        // checking if the senderId and the receiverId is the same, if sane then return
        if(userData.id == senderId) {
            console.log("sender id and receiver id is same");
            return res.status(400).json({
                'success': false,
                'error': "Cannot Accept notificaton from yourself"
            })
        }

        // checking if the senderId is received from the body or not
        if(!senderId) {
            console.log("Sender id not received");
            return res.status(400).json({
                "success": false,
                "error": "sender id is required"
            });
        }

        // getting the user and sender
        const user = await User.findById(userData.id);
        const sender = await User.findById(senderId);

        // error handling
        if(!user) {
            return res.status(400).json({
                "success": false,
                "error": "User id not found"
            });
        }

        if(!sender) {
            return res.status(400).json({
                "success": false,
                "error": "Sender id not found"
            });
        }

        // check if the notification actually exists or not
        const notificationFromSenderExists = await User.findOne({
            _id: userData.id,
            notifications: {
                $elemMatch: {
                    userId: senderId
                }
            }
        });
        console.log(notificationFromSenderExists);

        if(!notificationFromSenderExists) {
            return res.status(400).json({
                "success": false,
                'error': 'notification from sender does not exist'
            });
        }

        // remove the object from the notification array of the user
        user.notifications = user.notifications.filter(notification =>
            !(notification.userId.toString() === senderId.toString())
        );

        // add each others id, to the contacts array
        if(!user.contacts.includes(senderId)) {
            user.contacts.push(senderId);
        }

        if(!sender.contacts.includes(userData.id)) {
            sender.contacts.push(userData.id);
        }

        // saving updated documents
        await user.save();
        await sender.save();

        return res.status(200).json({
            'success': true,
            'message': 'Notification accepted'
        });
    } catch(err) {
        console.log("An error occured =", err);
        return res.status(500).json({"error": "Internal server error"});
    }
});

router.post('/add_contact/decline', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.jwtPayload;
        const { senderId } = req.body;

        // error handling
        if(!senderId) {
            console.log("Sender id not received");
            return res.status(400).json({
                "success": false,
                "error": "sender id is required"
            });
        }

        // deleting the notification
        await User.updateOne(
            {_id: userData.id},
            { $pull: { notifications: { userId: senderId } } }
        );

        // returning response
        return res.status(200).json({
            "success": true,
            "message": "Notification deleted successfully"
        })
    } catch(err) {
        console.log("An error occured =", err);
        return res.status(500).json({"error": "internal server error"});
    }
});


router.get('/get_notifications', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.jwtPayload.id;

        if(!userId) {
            return res.status(400).json({
                "success": false,
                "message": "No user Id found"
            });
        }

        const user = await User.findById(userId);

        if(!user) {
            return res.status(400).json({
                "success": false,
                "message": "User not found!"
            })
        }

        return res.status(200).json({
            "success": true,
            "notifications": user.notifications
        })
    } catch(err) {
        console.log("An error occured in route /get_notifications =", err);
        return res.status(500).json({"error": "Internal Server Error"});
    }
})

// router.post('/add_contact', jwtAuthMiddleware, async(req, res) => {
//     try {
//         const userData = req.jwtPayload;
//         const data = req.body;
//         const contactId = data.contactId;
//         console.log(userData);
//         console.log(contactId);
        
//         // Checking if the contact id is present in the req body
//         if(!data) {
//             return res.status(200).json({
//                 "success": false,
//                 "error": "Contact Id is required"
//             })
//         }
//         const user = await User.findById(userData.id);
        
//         // checking if the user exists by the user id
//         if(!user) {
//             return res.status(401).json({
//                 "success": false,
//                 "error": "User does not exist"
//             });
//         }

//         if(contactId === user.id) {
//             return res.status(200).json({
//                 "success": false,
//                 "error": "The contact cannot be the user"
//             })
//         }

//         // checking if the contact already exists
//         if(user.contacts.includes(contactId)) {
//             return res.status(200).json({
//                 "success": false,
//                 "error": "Contact already exists"
//             });
//         }

//         // If all the edge cases are checked we add the contact
//         user.contacts.push(contactId);
//         await user.save();


//         return res.status(200).json({
//             "success": true,
//             "message": "Contact Added Succesfully", 
//             "contacts": user.contacts
//         });
//     } catch(err) {
//         console.log("An error occured = ", err );
//         res.status(500).json({"error": "Internal Server Error"});
//     } 
// });

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

router.post('/search_email', async(req, res) => {
    const { searchTerm } = req.body;

    const regex = new RegExp(`^${searchTerm}`, 'i');
    try {
        const users = await User.aggregate([
            {
              $project: {
                name: 1,
                email: 1,
                username: { $arrayElemAt: [{ $split: ['$email', '@'] }, 0] }
              }
            },
            {
              $match: {
                username: regex
              }
            }
          ]);
        res.status(200).json(users);
    } catch(err) {
        console.log(err);
        return res.status(500).json({"error": "Internal Server Error"});
    }
});

module.exports = router;