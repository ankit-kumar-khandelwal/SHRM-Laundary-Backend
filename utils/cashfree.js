const axios = require('axios');
const crypto = require('crypto');

class CashfreeAPIClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = this.config.env === 'TEST'
      ? 'https://sandbox.cashfree.com/pg'
      : 'https://api.cashfree.com/pg';
  }

  // Create Order
  async createOrder(orderData) {
    try {
      const payload = {
        order_id: orderData.orderId,
        order_amount: orderData.amount,
        order_currency: orderData.currency || 'INR',
        customer_details: {
          customer_id: orderData.customerId,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
        },
        order_meta: {
          return_url: orderData.returnUrl,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/orders`,
        payload,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
            'Content-Type': 'application/json',
          },
        }
      );

      const paymentLink = `${this.baseUrl}/pay?order_id=${response.data.order_id}`;
      return { ...response.data, paymentLink };
    } catch (error) {
      console.error('Create order error:', error.response?.data || error.message);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Get Order Status
  async getOrderStatus(orderId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/orders/${orderId}`,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get order status: ${error.message}`);
    }
  }

  // Verify Webhook Signature
  verifyWebhookSignature(webhookBody, webhookSignature) {
    try {
      const computedSignature = crypto
        .createHmac('sha256', this.config.secretKey)
        .update(JSON.stringify(webhookBody))
        .digest('hex');

      return computedSignature === webhookSignature;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }

  // Create Payment Link
  async createPaymentLink(linkData) {
    try {
      const payload = {
        link_id: linkData.linkId,
        link_amount: linkData.amount,
        link_currency: linkData.currency || 'INR',
        link_purpose: linkData.purpose,
        customer_details: {
          customer_id: linkData.customerId,
          customer_name: linkData.customerName,
          customer_email: linkData.customerEmail,
          customer_phone: linkData.customerPhone,
        },
        link_partial_payments: linkData.allowPartialPayments,
        link_minimum_partial_amount: linkData.minPartialAmount,
        link_expiry_time: linkData.expiryTime,
        link_notify: {
          notify_sms: linkData.notifySMS,
          notify_email: linkData.notifyEmail,
        },
        link_auto_reminders: linkData.autoReminders,
        link_notes: linkData.notes,
        link_meta: linkData.meta,
        order_splits: linkData.orderSplits,
      };

      const response = await axios.post(
        `${this.baseUrl}/links`,
        payload,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
            'x-request-id': linkData.requestId,
            'x-idempotency-key': linkData.idempotencyKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Create payment link error:', error.response?.data || error.message);
      throw new Error(`Failed to create payment link: ${error.message}`);
    }
  }

  // Fetch Settlement Report
  async fetchSettlementReport(startDate, endDate) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/settlements?from_date=${startDate}&to_date=${endDate}`,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch settlement report: ${error.message}`);
    }
  }

  // Fetch Payout Report
  async fetchPayoutReport(startDate, endDate) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payouts?from_date=${startDate}&to_date=${endDate}`,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch payout report: ${error.message}`);
    }
  }

  // Fetch Refund Report
  async fetchRefundReport(startDate, endDate) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/refunds?from_date=${startDate}&to_date=${endDate}`,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch refund report: ${error.message}`);
    }
  }

  // Refund Order
  async refundOrder(orderId, refundAmount) {
    try {
      const payload = {
        order_id: orderId,
        refund_amount: refundAmount,
      };

      const response = await axios.post(
        `${this.baseUrl}/refunds`,
        payload,
        {
          headers: {
            'x-client-id': this.config.appId,
            'x-client-secret': this.config.secretKey,
            'x-api-version': this.config.apiVersion,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to refund order: ${error.message}`);
    }
  }
}

module.exports = CashfreeAPIClient;