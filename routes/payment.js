const express = require('express');
const authorization = require("../utils/authorization");
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/successful', paymentController.successful);

module.exports = router;