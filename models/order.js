const mongoose = require('mongoose');

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    products: [{
        _id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'},
        quantity: { type: Number },
        price: { type: Number } // jo admi 1 month pehle kuch khrida usko sirf wahi price dikhna chahiye....updated/decreased price Product schema mei dikhna chahiye
    }],
    totalPrice: { type: Number, required: true },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Define the Order model
module.exports = mongoose.model('Order', OrderSchema);
