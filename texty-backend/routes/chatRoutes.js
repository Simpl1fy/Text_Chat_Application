const express = require('express');
const router = express.Router();

const { jwtAuthMiddleware } = require('../middleware/jwt');
const ChatRoom = require('../database/Models/chatRoom');

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

module.exports = router;