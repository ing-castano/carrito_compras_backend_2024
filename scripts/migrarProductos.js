require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('../src/models/producto'); // Ajusta la ruta según tu estructura
const productosJSON = require('../src/models/productos.json'); // Ruta al archivo JSON

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.log('Error al conectar con MongoDB:', error);
  });

// Función para insertar productos en la base de datos
async function migrarProductos() {
  try {
    // Limpiar la colección de productos (si quieres borrar los existentes antes de insertar nuevos)
    await Producto.deleteMany({});

    // Insertar los productos
    const productos = await Producto.insertMany(productosJSON);
    console.log('Productos migrados con éxito:', productos);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al migrar los productos:', error);
    mongoose.connection.close();
  }
}

// Ejecutar la migración
migrarProductos();
