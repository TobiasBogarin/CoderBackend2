
# Proyecto: API de Gestión de Productos y Carritos

## Funcionalidades

### Productos
- Crear productos.
- Listar todos los productos.
- Obtener un producto por su ID.
- Actualizar productos (excepto el campo `id`).
- Eliminar productos.

### Carritos
- Crear carritos.
- Listar los productos de un carrito.
- Agregar productos a un carrito.
- Eliminar productos de un carrito.


### Inicializar el servidor
Inicia el servidor ejecutando el siguiente comando:
```bash
node src/app.js
```
El servidor estará disponible en `http://localhost:8080`.

---

## Endpoints

### **Productos (`/api/products`)**

#### 1. Listar todos los productos
- **URL:** `GET /api/products`
- **Query params opcionales:** `?limit` (limita la cantidad de productos devueltos)
- **Ejemplo de respuesta:**
  ```json
  [
    {
      "id": 1,
      "title": "Laptop",
      "description": "Laptop Dell XPS",
      "code": "XPS13",
      "price": 1500,
      "status": true,
      "stock": 10,
      "category": "electronics",
      "thumbnails": ["url1", "url2"]
    }
  ]
  ```

#### 2. Obtener un producto por ID
- **URL:** `GET /api/products/:pid`
- **Ejemplo de respuesta:**
  ```json
  {
    "id": 1,
    "title": "Laptop",
    "description": "Laptop Dell XPS",
    "code": "XPS13",
    "price": 1500,
    "status": true,
    "stock": 10,
    "category": "electronics",
    "thumbnails": ["url1", "url2"]
  }
  ```

#### 3. Crear un producto
- **URL:** `POST /api/products`
- **Body:**
  ```json
  {
    "title": "Laptop",
    "description": "Laptop Dell XPS",
    "code": "XPS13",
    "price": 1500,
    "status": true,
    "stock": 10,
    "category": "electronics",
    "thumbnails": ["url1", "url2"]
  }
  ```
- **Ejemplo de respuesta:**
  ```json
  {
    "id": 1,
    "title": "Laptop",
    "description": "Laptop Dell XPS",
    "code": "XPS13",
    "price": 1500,
    "status": true,
    "stock": 10,
    "category": "electronics",
    "thumbnails": ["url1", "url2"]
  }
  ```

#### 4. Actualizar un producto
- **URL:** `PUT /api/products/:pid`
- **Body:** (Solo los campos a actualizar)
  ```json
  {
    "stock": 15
  }
  ```
- **Ejemplo de respuesta:**
  ```json
  {
    "id": 1,
    "title": "Laptop",
    "description": "Laptop Dell XPS",
    "code": "XPS13",
    "price": 1500,
    "status": true,
    "stock": 15,
    "category": "electronics",
    "thumbnails": ["url1", "url2"]
  }
  ```

#### 5. Eliminar un producto
- **URL:** `DELETE /api/products/:pid`
- **Ejemplo de respuesta:**
  ```json
  {
    "message": "Producto eliminado correctamente"
  }
  ```

---

### **Carritos (`/api/carts`)**

#### 1. Crear un carrito
- **URL:** `POST /api/carts`
- **Ejemplo de respuesta:**
  ```json
  {
    "id": 1,
    "products": []
  }
  ```

#### 2. Listar los productos de un carrito
- **URL:** `GET /api/carts/:cid`
- **Ejemplo de respuesta:**
  ```json
  [
    {
      "product": 1,
      "quantity": 1
    }
  ]
  ```

#### 3. Agregar un producto a un carrito
- **URL:** `POST /api/carts/:cid/product/:pid`
- **Ejemplo de respuesta:**
  ```json
  {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 1
      }
    ]
  }
  ```

#### 4. Eliminar un producto de un carrito
- **URL:** `DELETE /api/carts/:cid/product/:pid`
- **Ejemplo de respuesta:**
  ```json
  {
    "message": "Producto eliminado del carrito",
    "cart": {
      "id": 1,
      "products": []
    }
  }
  ```

---

## Estructura del proyecto
```
src/
├── data/
│   ├── products.json       // Archivo JSON para productos
│   ├── carts.json          // Archivo JSON para carritos
├── routes/
│   ├── products.js         // Rutas para productos
│   ├── carts.js            // Rutas para carritos
├── app.js                  // Archivo principal del servidor
```

---

## Tecnologías 
- **Node.js**
- **Express**
- **FileSystem (fs)** para persistencia de datos.

---

