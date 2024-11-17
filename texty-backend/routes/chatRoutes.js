const express = require('express');
const router = express.Router();

const { jwtAuthMiddleware } = require('../middleware/jwt');
const ChatRoom = require('../database/Models/chatRoom');
const Message = require('../database/Models/message');

router.post('/room', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.jwtPayload.id;
        const { otherUserId } = req.body;

        if(!otherUserId) return res.status(400).json({"error": "Other user id is required"});

        if(otherUserId === userId) {
            return res.status(400).json({"error": "Cannot create chat room with yourself"});
        }

        const room = await ChatRoom.findOrCreateRoom(userId, otherUserId);

        return res.status(200).json({
            room_id: room._id,
            participants: room.participants
        });
    } catch(err) {
        console.error("An error occured =", err);
        return res.status(500).json({"Message": "Internal Server Error"});
    }
});


router.get('/fetch', async (req, res) => {
    try {
        const roomId = req.query.roomId;
        if(!roomId) {
            console.log("No room id provided");
            return res.status(401).json({"error": "No room id sent"})
        }
        const room = await Message.find({ roomId: roomId });

        if(!room) {
            console.log("Wrong room id");
            return res.status(401).json({"error": "No such room id exists"});
        }
        console.log(room[0]);
        return res.status(200).json(room[0].text);
    } catch(err) {
        console.error("An error occured while fetching messages of a room =", err);
        return res.status(500).json({"Error": "Internal Server Error"});
    }
}) 

module.exports = router;