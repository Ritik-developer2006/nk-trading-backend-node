const crypto = require("crypto");
const razorpay = require("../utils/razorpay.instance");

/**
 * CREATE ORDER
 * POST /api/payment/create-order
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: amount * 100, // rupees → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

/**
 * VERIFY PAYMENT
 * POST /api/payment/verify-payment
 */
exports.verifyPayment = (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // TODO: Save payment in DB, update order status
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

/**
 * REFUND PAYMENT (OPTIONAL)
 * POST /api/payment/refund
 */
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined,
    });

    return res.status(200).json({
      success: true,
      refund,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Refund failed",
      error: error.message,
    });
  }
};
