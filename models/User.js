const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        required : true,
        enum: ["admin","customer", "vendor"]
      }
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);
