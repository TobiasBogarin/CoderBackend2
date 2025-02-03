const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

// Configurar variables de entorno
dotenv.config();

// Routers
const viewsRouter = require('./routes/views.router');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar a MongoDB
connectDB();

// Configuración de Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// WebSockets
io.on('connection', async (socket) => {
  console.log('Usuario conectado');

  try {
    const products = await Product.find().lean();
    socket.emit('init-products', products);
  } catch (error) {
    console.error('Error al cargar productos:', error.message);
  }

  socket.on('addProduct', async (productData) => {
    try {
        // Validar que todos los campos obligatorios estén presentes
        if (!productData.title || !productData.description || !productData.price || 
            !productData.stock || !productData.category || !productData.code) {
            socket.emit('error', { message: 'Faltan campos obligatorios' });
            return;
        }

        const newProduct = await Product.create(productData);
        const updatedProducts = await Product.find().lean();
        io.emit('update-products', updatedProducts);
    } catch (error) {
        console.error('Error al agregar producto:', error.message);
        socket.emit('error', { message: 'Error al agregar producto' });
    }
});


  socket.on('deleteProduct', async (productId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        socket.emit('error', { message: 'ID inválido' });
        return;
      }

      await Product.findByIdAndDelete(productId);
      const updatedProducts = await Product.find().lean();
      io.emit('update-products', updatedProducts);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
      socket.emit('error', { message: 'Error al eliminar producto' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Manejar conexión de MongoDB
mongoose.connection.once('open', () => {
  console.log('✅ Conectado a MongoDB');
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión a MongoDB:', err);
  process.exit(1);
});

module.exports = { app, io };
