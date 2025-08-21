import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    console.log('Place order request received:', req.body);
    console.log('User ID from token:', req.body.userId);
    
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    console.log('Order data to save:', orderData);

    const newOrder = new Order(orderData);
    await newOrder.save();

    console.log('Order saved successfully:', newOrder._id);

    // Only clear cart if user exists and order was saved successfully
    if (userId) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
      console.log('Cart cleared for user:', userId);
    }

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log('Error in placeOrder:', error);
    res.json({ success: false, message: error.message });
  }
}

// placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now()
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// All Orders data for Admin Panel
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { 
  placeOrder, 
  placeOrderStripe, 
  placeOrderRazorpay, 
  listOrders, 
  userOrders, 
  updateStatus 
};
