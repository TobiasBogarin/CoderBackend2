
# API de Gestión de Productos y Carritos con Vistas en Tiempo Real

## Descripción
Este proyecto consiste en una API destinada a la gestión de productos y carritos de compras, complementada con funcionalidades de vistas en tiempo real mediante el uso de **Socket.IO**. Incluye la capacidad de realizar operaciones de creación, lectura, actualización y eliminación sobre productos, así como la administración detallada de carritos de compras. Todas las interfaces presentan un diseño unificado para garantizar una experiencia de usuario coherente.

## Requisitos del Sistema
- **Node.js**: versión 14 o superior.
- **npm**: versión 6 o superior.

## Proceso de Instalación
1. Clonar el repositorio desde el sistema de control de versiones:
   ```bash
   git clone <URL-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. Instalar las dependencias necesarias mediante npm:
   ```bash
   npm install
   ```

3. Verificar la existencia de los archivos necesarios en la carpeta `src/data`:
   - **products.json**:
     ```json
     []
     ```
   - **carts.json**:
     ```json
     []
     ```

   Si no se encuentran, crear los archivos y asegurarse de que estén vacíos inicialmente.

4. Iniciar el servidor ejecutando el siguiente comando:
   ```bash
   node app.js
   ```

5. Acceder a la aplicación a través del navegador en la dirección `http://localhost:8080`.

## Funcionalidades

### Gestión de Productos
#### Endpoints de la API
- **GET** `/api/products`: Recuperar todos los productos disponibles.
- **POST** `/api/products`: Crear un nuevo producto con los datos proporcionados.
- **PUT** `/api/products/:pid`: Modificar un producto existente mediante su identificador único.
- **DELETE** `/api/products/:pid`: Eliminar un producto utilizando su identificador único.

#### Vista de Productos
- **URL**: `/products`
- Presenta una lista de todos los productos almacenados en el archivo `products.json`.
- Refleja los cambios realizados en los productos al recargar la página.

### Gestión de Carritos
#### Endpoints de la API
- **POST** `/api/carts`: Crear un nuevo carrito.
- **GET** `/api/carts/:cid`: Obtener los productos contenidos en un carrito específico.
- **POST** `/api/carts/:cid/product/:pid`: Agregar un producto a un carrito.
- **DELETE** `/api/carts/:cid/product/:pid`: Eliminar un producto de un carrito específico.

### Vista en Tiempo Real
- **URL**: `/realtimeProducts`
- Muestra los productos almacenados en `products.json` con actualizaciones en tiempo real.
- Permite:
  - Agregar nuevos productos mediante un formulario interactivo.
  - Eliminar productos utilizando botones específicos.
- Los cambios en la lista de productos se reflejan automáticamente gracias a **Socket.IO**.

## Estructura del Proyecto
```
├── src
│   ├── app.js               # Archivo principal del servidor
│   ├── data
│   │   ├── products.json    # Archivo de persistencia para productos
│   │   └── carts.json       # Archivo de persistencia para carritos
│   ├── public
│   │   └── css
│   │       └── styles.css   # Estilos globales
│   ├── routes
│   │   ├── carts.js         # Rutas para carritos
│   │   ├── products.js      # Rutas para productos
│   │   └── views.router.js  # Rutas para vistas
│   └── views
│       ├── layouts
│       │   └── main.handlebars  # Layout principal para vistas
│       ├── products.handlebars # Vista de productos
│       └── realtimeProducts.handlebars # Vista en tiempo real
```

## Procedimiento de Pruebas
### Pruebas de los Endpoints de la API
Se pueden utilizar herramientas como **Postman** o **cURL** para probar los endpoints. Ejemplos:
- Obtener todos los productos:
  ```bash
  curl -X GET http://localhost:8080/api/products
  ```
- Crear un nuevo producto:
  ```bash
  curl -X POST http://localhost:8080/api/products     -H "Content-Type: application/json"     -d '{"title": "Nuevo Producto", "description": "Descripción", "code": "ABC123", "price": 100, "stock": 10, "category": "general"}'
  ```

### Pruebas de las Vistas
1. Acceder a la URL `/products` para visualizar la lista de productos.
2. Acceder a `/realtimeProducts` para interactuar con los productos en tiempo real, probando la creación y eliminación de productos.

## Notas Adicionales
- Este proyecto utiliza **FileSystem** para garantizar la persistencia de datos en los archivos `products.json` y `carts.json`.
- Todos los cambios realizados a través de los endpoints o las vistas se reflejan automáticamente en los archivos de datos.

---
Este proyecto constituye una implementación completa y modularizada para la gestión de productos y carritos, ideal para aplicaciones que requieren sincronización en tiempo real. A disposición para consultas y ampliaciones. 🚀
