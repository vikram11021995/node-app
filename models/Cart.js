const mongoose = require('mongoose');

// Define the Cart schema
const CartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [{
        // productId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: 'Product'
        // },
        quantity: {
            type: Number,
            default: 1
        },
        // price: {
        //     type: Number,
        //     required: true
        // }
    }]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Define the Cart model
module.exports = mongoose.model('Cart', CartSchema);
