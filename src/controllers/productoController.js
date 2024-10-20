const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Producto = require('../models/producto')

// Función para obtener todos los productos desde el archivo JSON
const obtenerProductos = async () => {
  // Cargar productos desde productos.json
  const productosPath = path.join(__dirname, '../models/productos.json')

  // Verifica que el archivo JSON exista y cargue los productos
  try {
    const data = await fs.promises.readFile(productosPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw error
  }
}

// Agregar un nuevo producto
const agregarProducto = async ({ nombre, precio }) => {
  const productos = await obtenerProductos();
  const nuevoProducto = {
    id: productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1,
    nombre,
    precio: parseFloat(precio)
  };
  productos.push(nuevoProducto);

  await fs.promises.writeFile(productosFile, JSON.stringify(productos, null, 2), 'utf-8');
  return nuevoProducto;
};

// Editar un producto existente
const editarProducto = async (id, { nombre, precio }) => {
  const productos = await obtenerProductos();
  const productoIndex = productos.findIndex(p => p.id === parseInt(id));

  if (productoIndex !== -1) {
    productos[productoIndex].nombre = nombre;
    productos[productoIndex].precio = parseFloat(precio);

    await fs.promises.writeFile(productosFile, JSON.stringify(productos, null, 2), 'utf-8');
    return productos[productoIndex];
  } else {
    throw new Error('Producto no encontrado');
  }
};

// Eliminar un producto
const eliminarProducto = async (id) => {
  const productos = await obtenerProductos();
  const productosFiltrados = productos.filter(p => p.id !== parseInt(id));

  await fs.promises.writeFile(productosFile, JSON.stringify(productosFiltrados, null, 2), 'utf-8');
  return;
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
};