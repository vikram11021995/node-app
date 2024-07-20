const Order = require('../models/order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productIds } = req.body; //see db and take productIds from cart because items that are there in cart, can be only ordered
        console.log("productIds : ", productIds);
        console.log("productIds.length : ", productIds.length);


        // Find the user's cart
        const cart = await Cart.findOne({ customerId: userId });
        console.log("cart", cart);
        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        }

        // Find the products by product IDs
        let products = await Product.find({ _id: { $in: productIds } });
        console.log("products", products);
        console.log("products length", products.length);


        if (products.length !== productIds.length) {
            return res.status(400).json({ message: 'Some products were not found' });
        }

        // Create the order products array
        let orderProducts = [];
        console.log("orderProducts", orderProducts);

        let totalPrice = 0;
        
        for (let i = 0; i < products.length; i++) { //product
            console.log("products.length", products.length);
            for (let j = 0; j < cart.products.length; j++) { //cart
            console.log("cart.products", cart.products);

                if (products[i]._id.toString() == cart.products[j]._id.toString()) {
                    const productOrder = {
                        _id: products[i]._id,
                        quantity: cart.products[j].quantity,
                        price: products[i].price
                    };

                    // console.log("productOrder", productOrder);
                    totalPrice += productOrder.quantity * productOrder.price;
                    // console.log("totalPrice", totalPrice);

                    orderProducts.push(productOrder);
                    // console.log("orderProducts", orderProducts);

                }
            }
        }

        if (orderProducts.length === 0) {
            return res.status(400).json({ message: 'No matching products found in cart' });
        }

        const order = new Order({
            customerId: userId,
            products: orderProducts,
            totalPrice: totalPrice
        })
        await order.save();

        console.log("order", order);
        res.status(200).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
