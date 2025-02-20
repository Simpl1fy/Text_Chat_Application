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
        if(room[0]) {
            return res.status(200).json(room[0].messages);
        } else {
            return res.status(200).json([]);
        }
        
    } catch(err) {
        console.error("An error occured while fetching messages of a room =", err);
        return res.status(500).json({"Error": "Internal Server Error"});
    }
})

router.post('/update-seen', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.jwtPayload.id;
        const { roomId } = req.body;

        console.log("User id =", userId);
        console.log("Room id =", roomId);

        if(!userId) {
            console.log("User Id not found!");
            return res.status(200).json({success: false, message: "User Id not found"});
        }

        if(!roomId) {
            console.log("Room Id not found!");
            return res.status(200).json({success: false, message: "Room Id not found"});
        }

        const messageDoc = await Message.findOne({ roomId });

        console.log("Message Doc =", messageDoc);

        if(!messageDoc) {
            console.log("No such messages found with the room id");
            return res.status(200).json({
                success: false,
                message: "Failed to update seen id's, no such room id found"
            })
        }

        const updatedMessageDoc = await messageDoc.updateOne(
            { roomId },
            { $addToSet: { "messages.$[].seenBy": userId } }
        );

        console.log(updatedMessageDoc);

        return res.status(200).json({
            success: true,
            message: "message seen by user updated successfully"
        })
    } catch(err) {
        console.log("An error occured while updating read user Ids =", err);
    }
});

router.post('/delete', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.jwtPayload.id;
        const { roomId } = req.body;
        console.log("Room id =", roomId);
        if(!userId) {
            return res.status(200).json({"error": "need userId"});
        }
        if(!roomId) {
            return res.status(200).json({"Error": "Need Room id"});
        }
        const result = await Message.updateOne(
            {roomId},
            { $set: { text: [] } }
        )
        console.log(result);
        if(result.nModified === 0) {
            return res.status(200).json({"Error": "No such room with the room Id"});
        }
        return res.status(200).json({
            "Message": "Chat deleted succesfully",
            "success": true
        });
    } catch(err) {
        console.log("An error occured while deleting the chat =", err);
        return res.status(500).json({"Error": "Internal Server Error"});
    }
})

module.exports = router;