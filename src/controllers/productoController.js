const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Producto = require('../models/producto')

const productosPath = path.join(__dirname, '../models/productos.json')

// Función para obtener todos los productos desde el archivo JSON
const obtenerProductos = async () => {
  try {
   return await Producto.find();
  } catch (error) {
    console.error("Error al obtener productos de MongoDB:", error);
    throw new Error("No se pudieron cargar los productos desde la base de datos");
  }
};

//Generar Id del nuevo producto
const generarIdProducto = async () => {
  const ultimoProducto = await Producto.findOne().sort({ id: -1 });
  return ultimoProducto ? ultimoProducto.id + 1 : 1;
};
// Agregar un nuevo producto

const agregarProducto = async (productoData) => {
  try {
    const nuevoId = await generarIdProducto(); // Generar un id único
    const nuevoProducto = new Producto({ ...productoData, id: nuevoId }); // Asignar el id generado
    await nuevoProducto.save();
  } catch (err) {
    throw new Error('Error al agregar producto: ' + err.message);
  }
};


// Editar un producto existente
const editarProducto = async (id, { nombre, categoria, precio, stock }) => {
  try {
    const producto = await Producto.findByIdAndUpdate(id, {
      nombre: nombre,
      categoria: categoria,
      precio: parseFloat(precio),
      stock: parseInt(stock),
    }, { new: true });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  } catch (err) {
    throw new Error('Error al editar el producto');
  }
};

// Eliminar un producto
const eliminarProducto = async (id) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      throw new Error('Producto no encontrado');
    }
  } catch (err) {
    throw new Error('Error al eliminar el producto');
  }
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
}
