const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        unique: true
    },
    messages: [
        {
            text: {
                type: String,
                required: true
            },
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            msgTimeStamp: {
                type: Date,
                default: Date.now(),
                required: true
            }
        }
    ],
    timeStamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;