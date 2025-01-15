const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsPath = path.resolve(__dirname, '../data/products.json');


router.get('/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    res.render('products', { products });
});


router.get('/realtimeProducts', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    res.render('realtimeProducts', { products });
});

module.exports = router;
