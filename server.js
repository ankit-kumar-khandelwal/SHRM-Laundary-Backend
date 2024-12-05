
const express = require('express');
const dotenv = require('dotenv');
const paymentRoutes = require('./Routes/payments');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/auth');
const orderRoutes = require('./Routes/orders');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});