const express = require('express');
// const authorization = require("../utils/authorization");
const productController = require('../controllers/productController');
const authorization = require("../utils/authorization");


const router = express.Router();

router.post('/create', authorization.jwtVerifyToken, authorization.checkUserRole(["admin", "vendor"]), productController.createProduct);
// router.get('/list-all', authorization.jwtVerifyToken, authorization.checkRoleAdmin, productController.getProducts);
router.get('/list-all', authorization.jwtVerifyToken, authorization.checkUserRole(["admin"]), productController.getProducts);

router.get('/:id', authorization.jwtVerifyToken, productController.getProductsById);
router.put('/:id', authorization.jwtVerifyToken, authorization.checkUserRole(["admin", "vendor"]), productController.updateProductById);
router.delete('/:id', authorization.jwtVerifyToken, authorization.checkUserRole(["admin"]), productController.deleteProductById);






module.exports = router;


