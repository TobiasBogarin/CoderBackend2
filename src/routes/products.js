const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsPath = './data/products.json';


const readProducts = () => {
  try {
    const data = fs.readFileSync(productsPath, 'utf8');
    console.log("Contenido del archivo leído:", data); 
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo de productos:", error.message);
    return [];
  }
};



const writeProducts = (products) => {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
};

router.get('/', (req, res) => {
  const products = readProducts();
  console.log("Productos enviados al cliente:", products); 
  res.json(products);
});



router.post('/', (req, res) => {
  const products = readProducts();
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
  const products = readProducts();
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const productIndex = products.findIndex((p) => p.id === parseInt(pid));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const updatedProduct = {
    ...products[productIndex],
    title: title ?? products[productIndex].title,
    description: description ?? products[productIndex].description,
    code: code ?? products[productIndex].code,
    price: price ?? products[productIndex].price,
    status: status ?? products[productIndex].status,
    stock: stock ?? products[productIndex].stock,
    category: category ?? products[productIndex].category,
    thumbnails: thumbnails ?? products[productIndex].thumbnails,
  };

  products[productIndex] = updatedProduct;
  writeProducts(products);
  res.status(200).json(updatedProduct);
});


router.delete('/:pid', (req, res) => {
  const products = readProducts();
  const { pid } = req.params;

  const productIndex = products.findIndex((p) => p.id === parseInt(pid));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  products.splice(productIndex, 1);
  writeProducts(products);
  res.status(200).json({ message: 'Producto eliminado correctamente.' });
});

module.exports = router;
