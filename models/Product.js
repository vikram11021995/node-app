const mongoose = require('mongoose');

// Define the Product schema
const ProductSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    vendorId: mongoose.Types.ObjectId
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', ProductSchema);
