const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsPath = './src/data/carts.json';
const productsPath = './src/data/products.json';

// Leer el archivo de carritos
const readCarts = () => {
  try {
    const data = fs.readFileSync(cartsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};


const writeCarts = (carts) => {
  fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2), 'utf8');
};


router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length ? carts[carts.length - 1].id + 1 : 1, 
    products: [],
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find((c) => c.id === parseInt(req.params.cid));
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  res.json(cart.products);
});


router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const cart = carts.find((c) => c.id === parseInt(req.params.cid));
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const existingProduct = cart.products.find((p) => p.product === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1; 
  } else {
    cart.products.push({ product: product.id, quantity: 1 });
  }

  writeCarts(carts);
  res.status(200).json(cart);
});


router.delete('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();

  const cart = carts.find((c) => c.id === parseInt(req.params.cid));
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const productIndex = cart.products.findIndex((p) => p.product === parseInt(req.params.pid));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }

  cart.products.splice(productIndex, 1); 
  writeCarts(carts);

  res.status(200).json({ message: 'Producto eliminado del carrito', cart });
});

module.exports = router;
