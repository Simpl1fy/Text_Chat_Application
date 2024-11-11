const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        unique: true
    },
    text: [{
        type: String,
        required: true
    }],
    timeStamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;