const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // Importa el modelo de órdenes


// 🔹 Middleware: Validar que el carrito existe
const validateCart = async (req, res, next) => {
  try {
      console.log(`🟢 Buscando carrito con ID: ${req.params.cid}`);

      const cart = await Cart.findById(req.params.cid).populate('products.product');

      if (!cart) {
          console.log("❌ Carrito no encontrado.");
          return res.status(404).json({
              status: 'error',
              message: 'Carrito no encontrado'
          });
      }

      console.log("🟢 Carrito encontrado:", JSON.stringify(cart, null, 2));

      req.cart = cart;
      next();
  } catch (error) {
      console.error("🔴 Error en validateCart:", error);
      res.status(500).json({
          status: 'error',
          message: 'Error interno del servidor'
      });
  }
};


// 🔹 Crear un carrito vacío
router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });

        res.status(201).json({
            status: 'success',
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 🔹 Obtener los productos de un carrito
router.get('/:cid', validateCart, (req, res) => {
    res.json({
        status: 'success',
        payload: req.cart.products
    });
});

// 🔹 Agregar un producto al carrito
router.post('/:cid/products/:pid', validateCart, async (req, res) => {
  try {
      const { quantity = 1 } = req.body;

      console.log(`🟢 Intentando agregar producto ${req.params.pid} al carrito ${req.params.cid}`);

      if (!mongoose.Types.ObjectId.isValid(req.params.pid)) {
          return res.status(400).json({
              status: 'error',
              message: 'ID de producto inválido'
          });
      }

      const product = await Product.findById(req.params.pid);
      if (!product) {
          return res.status(404).json({
              status: 'error',
              message: 'Producto no encontrado'
          });
      }

      console.log("🟢 Producto encontrado:", product.title);

      let existingProduct = req.cart.products.find(p => p.product.toString() === req.params.pid);
      
      if (existingProduct) {
          console.log("🔄 Producto ya en el carrito, aumentando cantidad.");
          existingProduct.quantity += quantity;
      } else {
          console.log("🆕 Producto no estaba en el carrito, agregando...");
          req.cart.products.push({ product: product._id, quantity });
      }

      console.log("🔄 Guardando cambios en el carrito antes de `save()`...");
      console.log("Carrito antes de guardar:", JSON.stringify(req.cart, null, 2));

      await req.cart.save();

      console.log("✅ Producto agregado correctamente:", JSON.stringify(req.cart, null, 2));
      
      res.json({
          status: 'success',
          payload: req.cart
      });
  } catch (error) {
      console.error("🔴 Error al agregar producto al carrito:", error);
      res.status(500).json({
          status: 'error',
          message: error.message
      });
  }
});

// 🔹 Eliminar un producto del carrito
router.delete('/:cid/products/:pid', validateCart, async (req, res) => {
    try {
        const productIndex = req.cart.products.findIndex(p => p.product._id.toString() === req.params.pid);

        if (productIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado en el carrito'
            });
        }

        const removedProduct = req.cart.products[productIndex];
        const product = await Product.findById(removedProduct.product._id);

        if (product) {
            product.stock += removedProduct.quantity; // Devolvemos el stock al eliminar
            await product.save();
        }

        req.cart.products.splice(productIndex, 1);
        await req.cart.save();

        res.json({
            status: 'success',
            payload: req.cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 🔹 Actualizar carrito completo
router.put('/:cid', validateCart, async (req, res) => {
    try {
        if (!Array.isArray(req.body.products)) {
            return res.status(400).json({
                status: 'error',
                message: 'Formato de productos inválido'
            });
        }

        req.cart.products = req.body.products.map(p => ({
            product: mongoose.Types.ObjectId(p.product),
            quantity: p.quantity
        }));

        await req.cart.save();

        res.json({
            status: 'success',
            payload: req.cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 🔹 Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', validateCart, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cantidad inválida'
            });
        }

        const item = req.cart.products.find(p => p.product._id.toString() === req.params.pid);

        if (!item) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado en el carrito'
            });
        }

        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado en la base de datos'
            });
        }

        if (product.stock + item.quantity < quantity) {
            return res.status(400).json({
                status: 'error',
                message: `Stock insuficiente. Disponible: ${product.stock + item.quantity}`
            });
        }

        product.stock += item.quantity - quantity; // Ajustamos el stock
        item.quantity = quantity;

        await product.save();
        await req.cart.save();

        res.json({
            status: 'success',
            payload: req.cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 🔹 Finalizar compra (checkout)
router.post('/:cid/checkout', validateCart, async (req, res) => {
  try {
      console.log("🟢 Finalizando compra para carrito:", req.params.cid);

      if (req.cart.products.length === 0) {
          return res.status(400).json({
              status: 'error',
              message: 'El carrito ya está vacío'
          });
      }

      let totalPrice = 0;
      for (const item of req.cart.products) {
          const product = await Product.findById(item.product._id);
          if (!product) {
              return res.status(404).json({
                  status: 'error',
                  message: `Producto con ID ${item.product._id} no encontrado`
              });
          }

          if (product.stock < item.quantity) {
              return res.status(400).json({
                  status: 'error',
                  message: `Stock insuficiente para ${product.title}. Disponible: ${product.stock}, Pedido: ${item.quantity}`
              });
          }

          product.stock -= item.quantity; // Reducir stock
          totalPrice += product.price * item.quantity;
          await product.save();
      }

      // ✅ Guardar la orden en `orders`
      const newOrder = await Order.create({
          cartId: req.params.cid,
          products: req.cart.products,
          totalPrice
      });

      console.log("✅ Orden guardada correctamente:", newOrder);

      // ✅ Vaciar el carrito en MongoDB
      req.cart.products = [];
      await req.cart.save();

      console.log("✅ Carrito vaciado correctamente en la BD.");

      // ✅ Crear un nuevo carrito vacío para el usuario
      const newCart = await Cart.create({ products: [] });

      console.log("✅ Nuevo carrito generado automáticamente:", newCart._id);

      res.json({
          status: 'success',
          message: 'Compra finalizada con éxito. Se ha generado un nuevo carrito.',
          order: newOrder,
          newCartId: newCart._id
      });

  } catch (error) {
      console.error("🔴 Error al finalizar la compra:", error);
      res.status(500).json({
          status: 'error',
          message: error.message
      });
  }
});


// 🔹 Vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (product) {
                product.stock += item.quantity; // Devolver stock al vaciar el carrito
                await product.save();
            }
        }

        cart.products = [];
        await cart.save();

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
