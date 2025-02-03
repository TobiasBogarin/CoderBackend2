const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Ruta para la página principal (redirigir a productos)
router.get('/', (req, res) => {
  res.redirect('/products');
});

// Ruta para renderizar la vista de productos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('products', { payload: products });
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para la vista en tiempo real
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('realtimeProducts', { payload: products });
  } catch (error) {
    console.error('Error al obtener productos en tiempo real:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
