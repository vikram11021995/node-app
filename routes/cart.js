const express = require('express');
const cartController = require('../controllers/cartController');
const authorization = require("../utils/authorization");


const router = express.Router();

// router.post('/', authorization.jwtVerifyToken, authorization.checkUserRole(["customer"]), cartController.addToCart);
router.post('/', authorization.jwtVerifyToken, cartController.addToCart);

router.get('/', authorization.jwtVerifyToken, authorization.checkUserRole(["customer", "admin"]), cartController.getTotalCartItems);

router.delete('/remove-cart-products/:id', authorization.jwtVerifyToken, cartController.removeProductFromCartItems);
// router.put('/update-cart-products/:id', authorization.jwtVerifyToken, cartController.removeProductFromCartItems);




module.exports = router;
