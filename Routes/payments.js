const express = require('express');
const router = express.Router();
const CashfreeService = require('../utils/cashfree');
const cashfreeConfig = require('../config/cashfree');

// Create an instance of CashfreeService
const cashfree = new CashfreeService(cashfreeConfig);

// Create Order Route
router.post('/create-order', async (req, res) => {
    try {
        const orderData = {
            orderId: `order_${Date.now()}`,  // Generate a unique order ID
            amount: req.body.amount,         // Amount should be passed in the request body
            currency: req.body.currency || 'INR', // Default to INR if no currency is specified
            customerId: req.body.customerId || `CUST_${Date.now()}`, // Generate customer ID if not provided
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            returnUrl: `${req.protocol}://${req.get('host')}/payment/callback`
        };

        // Call createOrder function from CashfreeService
        const orderResponse = await cashfree.createOrder(orderData);
        res.json(orderResponse);
    } catch (error) {
        console.error('Create order error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Webhook Verification Route
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    try {
        const webhookSignature = req.headers['x-webhook-signature'];
        const webhookBody = req.body;

        // Verify the webhook signature
        const isValidSignature = cashfree.verifyWebhookSignature(webhookBody, webhookSignature);
        if (!isValidSignature) {
            return res.status(400).json({ error: 'Invalid webhook signature' });
        }

        const event = webhookBody.event;
        switch (event) {
            case 'ORDER.PAID':
                console.log('Payment successful for order:', webhookBody.order.order_id);
                // Handle successful payment here
                break;
            case 'ORDER.FAILED':
                console.log('Payment failed for order:', webhookBody.order.order_id);
                // Handle failed payment here
                break;
            default:
                console.log('Unhandled webhook event:', event);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error.message);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Order Status Route
router.get('/order-status/:orderId', async (req, res) => {
    try {
        const orderStatus = await cashfree.getOrderStatus(req.params.orderId);
        res.json(orderStatus);
    } catch (error) {
        console.error('Order status error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
