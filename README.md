# 🛒 Proyecto Backend - E-commerce con Node.js y MongoDB

Este es un sistema de backend para un e-commerce que gestiona productos y carritos de compra, implementado con **Node.js**, **Express** y **MongoDB**.

---

## 🚀 Características principales

- **Productos**
  - Listado de productos con paginación, filtros y ordenamiento.
  - Visualización de un producto específico.
  - Agregar, actualizar y eliminar productos.

- **Carrito de Compras**
  - Crear un nuevo carrito.
  - Agregar productos al carrito.
  - Ver los productos en el carrito.
  - Eliminar productos del carrito.
  - Vaciar el carrito al finalizar la compra.

- **WebSockets**
  - Productos en tiempo real con actualización dinámica.
  - Notificaciones visuales con **Toastify** y confirmaciones con **SweetAlert2**.

---

## 🏗️ Instalación y configuración

### 1️⃣ Clonar el repositorio
```sh
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2️⃣ Instalar dependencias
```sh
npm install
```

### 3️⃣ Configurar variables de entorno
Crear un archivo `.env` en la raíz con:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=8080
```

### 4️⃣ Iniciar el servidor
```sh
npm start
```

El servidor correrá en **http://localhost:8080** 🚀.

---

## 📌 Endpoints

### 🛍️ Productos

- **GET** `/api/products?page=1&limit=10&sort=asc&query=categoria`
  - Obtiene productos con **paginación, filtros y ordenamiento**.
- **GET** `/api/products/:pid`
  - Obtiene un producto por ID.
- **POST** `/api/products`
  - Agrega un nuevo producto.
- **PUT** `/api/products/:pid`
  - Modifica un producto existente.
- **DELETE** `/api/products/:pid`
  - Elimina un producto por su ID.

---

### 🛒 Carrito de Compras

- **POST** `/api/carts/`
  - Crea un carrito nuevo.
- **GET** `/api/carts/:cid`
  - Obtiene los productos de un carrito.
- **POST** `/api/carts/:cid/products/:pid`
  - Agrega un producto al carrito.
- **DELETE** `/api/carts/:cid/products/:pid`
  - Elimina un producto del carrito.
- **PUT** `/api/carts/:cid`
  - Reemplaza el carrito con nuevos productos.
- **DELETE** `/api/carts/:cid`
  - Vacía el carrito.

---

## 🎨 Vistas

### 🛍️ Vista de Productos
- **URL:** `/products`
- Muestra una lista de productos con **paginación, filtros y ordenamiento**.
- Permite agregar productos al carrito.

### 🔄 Vista de Productos en Tiempo Real
- **URL:** `/realtimeproducts`
- Muestra productos actualizados en tiempo real mediante **WebSockets**.
- Permite agregar y eliminar productos dinámicamente.

### 🛒 Vista del Carrito
- **URL:** `/carts/:cid`
- Muestra los productos agregados al carrito en una ventana emergente.

---

## 📦 Tecnologías utilizadas

- **Node.js** y **Express.js**
- **MongoDB** con **Mongoose**
- **Handlebars** para las vistas
- **WebSockets (Socket.IO)**
- **SweetAlert2** y **Toastify.js** para notificaciones
- **Dotenv** para la configuración del entorno

---
x