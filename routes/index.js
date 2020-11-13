const express = require('express');
const productRoutes = require('./product.route');
const router = express.Router();

router.get('/status', (req, res) => res.json('OK'));

router.use('/product', productRoutes);
module.exports = router