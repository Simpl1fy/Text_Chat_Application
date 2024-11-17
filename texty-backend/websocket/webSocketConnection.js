const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const ChatRoom = require('../database/Models/chatRoom');
const Message = require('../database/Models/message');

const userConnections = new Map();
const userRooms = new Map();
const activeRoom = new Map();

async function validateRoomAccess(roomId, userId) {
    try {
        const room = await ChatRoom.findById(roomId);
        if(!room) return false;
        return room.participants.includes(userId);
    } catch(err) {
        console.error("Error validation room access =",err);
        return false;
    }
}

function setUpWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        try {
            const params = new URLSearchParams(req.url.split('?')[1]);
            const token = params.get('token');
            const roomId = params.get('roomId');

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(!decoded) {
                ws.close();
                return;
            }
            const userId = decoded.id;

            const hasAccess = await validateRoomAccess(roomId, userId);
            if(!hasAccess) {
                ws.close();
                return;
            }

            userConnections.set(userId, ws);
            userRooms.set(userId, roomId);

            if(!activeRoom.has(roomId)) {
                activeRoom.set(roomId, new Set());
            }
            activeRoom.get(roomId).add(userId);

            ws.send(JSON.stringify({ type: 'connection', message: 'Connection to websocket successful'}));

            // Handle messages
            ws.on('message', async (message) => {
                try {
                    // console.log(`Received message is = ${message.toString()}`);
                    const parsedMessage = message.toString();
                    console.log("Parsed Message is =", parsedMessage);
                    const msgToSend = JSON.stringify({
                        text: parsedMessage,
                        senderId: userId,
                        timeStamp: new Date()
                    });
                    const room = await ChatRoom.findById(roomId);
                    
                    if (!room) {
                        ws.close();
                        return;
                    }

                    // Get the other participant
                    const otherUserId = room.participants.find(p => p !== userId);

                    // Saving the text into the message document
                    const response = await Message.findOneAndUpdate(
                        {
                            roomId: roomId
                        },
                        {
                            $push: { 
                                messages: {
                                    text: parsedMessage,
                                    senderId: userId
                                }
                             }
                        },
                        {
                            new: true,
                            upsert: true
                        }
                    );

                    console.log("New Message saved =", response);
                    
                    // Send message to other participant if they're connected
                    const otherUserWs = userConnections.get(otherUserId);
                    if (otherUserWs && otherUserWs.readyState === WebSocket.OPEN) {
                        ws.send(msgToSend);
                        otherUserWs.send(msgToSend);
                    } else {
                        ws.send(msgToSend);
                    }

                    // Update last activity
                    await ChatRoom.findByIdAndUpdate(roomId, {
                        lastActivity: new Date()
                    });

                } catch (error) {
                    console.error('Error handling message:', error);
                }
            });

            ws.on('close', () => {
                userConnections.delete(userId);
                userRooms.delete(userId);
                const roomUsers = activeRoom.get(roomId);
                if (roomUsers) {
                    roomUsers.delete(userId);
                    if (roomUsers.size === 0) {
                        activeRoom.delete(roomId);
                    }
                }
            }); 

        } catch(err) {
            console.error("Error in connection setup =", err);
            ws.close();
        }
    });

    return wss;
}

module.exports = setUpWebSocket;