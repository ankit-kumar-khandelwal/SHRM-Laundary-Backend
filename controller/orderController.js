
const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { serviceType, items, totalPrice } = req.body;
    
    const order = new Order({
      userId: req.user._id,
      serviceType,
      items,
      totalPrice
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};