const Cart = require('../models/Cart');
const {generateToken} = require('../utils/authorization');


exports.addToCart = async (req, res) => {
    try {
        // Get the product details from the request body
        // we could have take product name instaead of productId, but product name can change, but id can never be changed. With id, one can see details of product in database
        const { productId, quantity } = req.body; // we can't keep products price, description as they are in product collection. 
        //we can't take price here. because if vendor in product collection update the price, then if we take price here also, then here price will not get updated.
        // though quantity is there in product collection. Here we need quantity also bcz customers who orders product should be shown quantity of items he orders


        // Get the user ID from the request user object
        const { userId } = req.user;
        console.log("Received productId:", productId);
        // console.log("Received price:", price);
        console.log("UserId from token:", userId);

        // Check if productId is provided
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if a cart exists for the user
        let cart = await Cart.findOne({ customerId: userId }).populate();
        console.log("cart", cart);
        if (cart) {
            // If the cart exists, check if the product is already in the cart
            const existingProductIndex = cart.products.findIndex(product => product._id.toString() === productId);
            console.log("Existing product index:", existingProductIndex);

            if (existingProductIndex !== -1) {
                // If the product is already in the cart, increase its quantity by 1
                cart.products[existingProductIndex].quantity += quantity || 1;
            } else {
                // If the product is not in the cart, add it to the cart's products array
                cart.products.push({ _id:productId, quantity: quantity || 1 });
            }

            // Save the updated cart
            cart = await cart.save();
        } else {
            // If the cart does not exist, create a new cart document
            cart = await Cart.create({ customerId: userId, products: [{ _id:productId, quantity: quantity || 1 }] });
        }

        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getTotalCartItems = async (req, res) => {
    try{
        const {userId} = req.user;
        console.log("userId in GET Controller : ", userId);
        let cart = await Cart.findOne({ "customerId":userId }).populate("products._id");
        console.log("cart : ", cart);
        let response = {
            "message": "Got the Cart successfully",
            "cart": cart
        }

        console.log("response : ", response);
        res.status(200).json(response);

    } catch(err) {
        res.status(401).json(err)
    }
}


exports.removeProductFromCartItems = async (req, res) => {
    try {
        const { userId } = req.user; // Extract userId from the verified token
        const { id } = req.params; // Get the product id from the request params
        console.log("id of product to be deleted : ", id);
        // Find the cart for the authenticated user
        const cart = await Cart.findOne({ customerId: userId }); //Each user has only one cart ie one document. so. findOne() returns single document. find() returns array of documents
        console.log("items coming in cart from db : ", cart);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the product to be removed
        const productIndex = cart.products.findIndex(product => product._id.toString() == id);
        console.log("productIndex : ", productIndex);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if(cart.products[productIndex].quantity>1){
            cart.products[productIndex].quantity = cart.products[productIndex].quantity-1;
        } else {
            // Remove the product from the cart's products array
            cart.products.splice(productIndex, 1);
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};