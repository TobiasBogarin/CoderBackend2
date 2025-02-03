const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// 🔹 GET /api/products - Obtener productos con paginación y filtros
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    const filter = query ? { category: query } : {}; // Filtrar por categoría si se especifica
    const sortOrder = sort === 'desc' ? -1 : 1; // Ordenación ascendente o descendente

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: { price: sortOrder }
    };

    const result = await Product.paginate(filter, options);

    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&query=${query || ''}&sort=${sort || ''}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&query=${query || ''}&sort=${sort || ''}` : null
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 🔹 GET /api/products/:pid - Obtener un solo producto
router.get('/:pid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const product = await Product.findById(req.params.pid);

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 🔹 POST /api/products - Crear un producto
router.post('/', async (req, res) => {
  try {
    const { title, description, price, stock, category, thumbnails, code, status } = req.body;

    if (!title || !description || !price || !stock || !category || !code) {
      return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      thumbnails: thumbnails || [],
      code,
      status: status ?? true
    });

    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 🔹 PUT /api/products/:pid - Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 🔹 DELETE /api/products/:pid - Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);

    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: { id: req.params.pid } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
