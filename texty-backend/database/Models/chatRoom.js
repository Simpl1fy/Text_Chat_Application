const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    participants: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
});

chatRoomSchema.index({ participants: 1 });

chatRoomSchema.statics.findOrCreateRoom = async function (participant1Id, participant2Id) {
    const participants = [participant1Id, participant2Id].sort();

    try {
        let room = await this.findOne({
            participants: { $all:participants, $size:2 }
        });

        // if no room exists create it
        if(!room) {
            room = await this.create({
                participants,
                createdAt: new Date(),
                lastActivity: new Date()
            });
        }
        
        // if room already exists return room, or create a room and return it.
        return room;
    } catch(err) {
        console.error("Error in Find and Create Room function = ", err);
        throw err;
    }
}

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;