const express = require("express");
const router = express.Router();
const controller = require("../controllers/payment.controller");

router.post("/create-order", controller.createOrder);
router.post("/verify-payment", controller.verifyPayment);
router.post("/refund", controller.refundPayment);

module.exports = router;