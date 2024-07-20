const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    paymentAmount: { type: Number },
    paymentStatus: { type: String, enum: ["successful","pending", "failed"] }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', PaymentSchema);