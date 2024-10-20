
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');

exports.processPayment = async (req, res) => {
  try {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const charge = await stripe.charges.create({
      amount: order.totalPrice * 100, // Stripe expects amount in cents
      currency: 'inr',
      source: token,
      description: `Payment for order ${orderId}`,
    });

    order.status = 'paid';
    await order.save();

    res.json({ message: 'Payment successful', charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};