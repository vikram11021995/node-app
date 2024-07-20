const express = require('express');
const authorization = require("../utils/authorization");
const userController = require('../controllers/userController');
// const { signup, login } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/all-user', authorization.jwtVerifyToken, userController.getUsers);

//post api for message & createdBy
router.post('/create-message', authorization.jwtVerifyToken, userController.createMessage);
router.get('/signout', authorization.jwtVerifyToken, userController.signout);


module.exports = router;
