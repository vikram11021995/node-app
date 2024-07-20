const express = require('express');
const orderController = require('../controllers/orderController');
const authorization = require("../utils/authorization");


const router = express.Router();

router.post('/', authorization.jwtVerifyToken, orderController.createOrder);
router.post('/:id', authorization.jwtVerifyToken, orderController.createOrder);






module.exports = router;
