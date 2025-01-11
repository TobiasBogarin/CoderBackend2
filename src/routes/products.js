const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsPath = './src/data/products.json';


router.get('/', (req, res) => {
  const limit = req.query.limit;
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer productos' });
    let products = JSON.parse(data);
    if (limit) {
      products = products.slice(0, limit);
    }
    res.json(products);
  });
});

module.exports = router;
