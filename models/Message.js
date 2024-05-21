const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Message', MessageSchema);
