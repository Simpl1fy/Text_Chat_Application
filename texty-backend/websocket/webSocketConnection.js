const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const ChatRoom = require('../database/Models/chatRoom');

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

            ws.send(JSON.stringify({
                type: 'system',
                message: 'Connected successfully',
                roomId,
                timestamp: new Date().toISOString()
            }));

            // Handle messages
            ws.on('message', async (message) => {
                try {
                    const parsedMessage = JSON.parse(message);
                    const room = await ChatRoom.findById(roomId);
                    
                    if (!room) {
                        ws.close();
                        return;
                    }

                    // Get the other participant
                    const otherUserId = room.participants.find(p => p !== userId);
                    
                    // Send message to other participant if they're connected
                    const otherUserWs = userConnections.get(otherUserId);
                    if (otherUserWs && otherUserWs.readyState === WebSocket.OPEN) {
                        otherUserWs.send(JSON.stringify({
                            type: 'message',
                            from: userId,
                            text: parsedMessage.text,
                            timestamp: new Date().toISOString()
                        }));
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
                const roomUsers = activeRooms.get(roomId);
                if (roomUsers) {
                    roomUsers.delete(userId);
                    if (roomUsers.size === 0) {
                        activeRooms.delete(roomId);
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