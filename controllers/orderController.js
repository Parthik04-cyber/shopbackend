import Order from "../models/orderModel.js";
import sgMail from '@sendgrid/mail';

// Set your SendGrid API Key in your environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const placeOrder = async (req, res) => {
  try {
    const { items, total, userEmail } = req.body;
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const order = new Order({ userEmail, items, total, otp, otpExpires });
    await order.save();
    await sgMail.send({
      from: 'your-verified-sender@yourdomain.com', // Replace with your SendGrid verified sender
      to: userEmail,
      subject: 'Order OTP Verification',
      text: `Your OTP for order verification is: ${otp}`,
      html: `<h1>Order Verification</h1>
            <p>Your OTP for order verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>`,
    });
    res.status(201).json({ success: true, message: "OTP sent to email", orderId: order._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOrderOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    const order = await Order.findById(orderId);
    console.log("Order fetched for OTP verification:", order);
    console.log("OTP provided:", otp);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    console.log("Order.otp:", order.otp, "Order.otpExpires:", order.otpExpires, "Current time:", new Date());
    if (order.otp !== otp || order.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
    order.status = "confirmed";
    order.otp = undefined;
    order.otpExpires = undefined;
    await order.save();
    res.json({ success: true, message: "Order confirmed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
