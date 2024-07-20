const Payment = require('../models/Payment');
const Order = require('../models/order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.successful = async (req, res) => {
    console.log("====> Inside payment/successful api controller");
    const { orderId, paymentAmount, paymentStatus } = req.body;
    try {
        const payment = new Payment({ orderId, paymentAmount, paymentStatus });
        await payment.save();

        const order = await Order.findOne({_id:orderId});
        const cart = await Cart.findOne({"customerId":order.customerId});

        for(let i=0; i<order.products.length; ++i){
            for(let j=0; j<cart.products.length; ++j){
                if (order.products[i]._id.toString() == cart.products[j]._id.toString()) {
                    let product = await Product.findOne({ _id:order.products[i]._id });
                    product.quantity -= order.products[i].quantity;
                    await product.save();
                    cart.products.splice(j, 1);
                }
            }
        }
        await cart.save();

        res.status(201).json({ "message": "Payment Successful", "Payment Details": payment });
    } catch (error) {
        console.log("error : ",error);
        res.status(500).json({ message: 'Server error' });
    }
};