const dotenv = require('dotenv');
dotenv.config();

const cashfreeConfig = {
    appId: process.env.CASHFREE_APP_ID,
    secretKey: process.env.CASHFREE_SECRET_KEY,
    apiVersion: process.env.CASHFREE_API_VERSION || '2022-09-01',
    env: process.env.CASHFREE_ENV || 'TEST'
};


module.exports = cashfreeConfig;