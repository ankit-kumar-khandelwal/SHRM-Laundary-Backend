// server.js
const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./Routes/orders');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./Routes/auth');

const orderRoutes = require('./Routes/orders');

const paymentRoutes = require('./Routes/payments');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
