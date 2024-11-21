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

// Agregar un nuevo producto
const agregarProducto = async ({ nombre, categoria, precio, stock }) => {
  const productos = await obtenerProductos()
  const nuevoProducto = new Producto({
    nombre: nombre,
    categoria: categoria,
    precio: parseFloat(precio),
    stock: parseInt(stock),
  });

  try {
    await nuevoProducto.save();
    return nuevoProducto;
  } catch (err) {
    throw err
  }
};

// Editar un producto existente
const editarProducto = async (id, { nombre, categoria, precio, stock }) => {
  const productos = await obtenerProductos()
  try {

  const productoIndex = await Producto.findByIdAndUpdate(id, {
    nombre : nombre,
    categoria : categoria,
    precio : parseFloat(precio),
    stock : parseInt(stock),
  }, { new: true} );

   return productoIndex;
  } catch(err) {
    throw new Error('Producto no encontrado')
  }
}

// Eliminar un producto
const eliminarProducto = async (id) => {
  try {
    await Producto.findByIdAndDelete(id);
  } catch (err) {
   throw err;
  }
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
}
