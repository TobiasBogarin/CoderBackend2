const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const viewsRouter = require('./routes/views.router');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productsPath = path.resolve(__dirname, './data/products.json');


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());


app.use('/', viewsRouter);


io.on('connection', (socket) => {
    console.log('Usuario conectado');


    socket.on('addProduct', (product) => {
        try {
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            const newProduct = {
                id: products.length ? products[products.length - 1].id + 1 : 1,
                ...product,
            };
            products.push(newProduct);
            fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
            io.emit('updateProducts', products); // Actualizar la lista en tiempo real
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });


    socket.on('deleteProduct', (id) => {
        try {
            const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            const updatedProducts = products.filter((product) => product.id !== id);
            fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
            io.emit('updateProducts', updatedProducts); // Actualizar la lista en tiempo real
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { app, io };
