const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Producto = require('../models/producto')

const productosPath = path.join(__dirname, '../models/productos.json')

// Función para obtener todos los productos desde el archivo JSON
const obtenerProductos = async () => {
  // Verifica que el archivo JSON exista y cargue los productos
  try {
    const data = await fs.promises.readFile(productosPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw error
  }
}

// Agregar un nuevo producto
const agregarProducto = async ({ nombre, categoria, precio, stock }) => {
  const productos = await obtenerProductos()
  const nuevoProducto = {
    id: productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
    nombre: nombre,
    categoria: categoria,
    precio: parseFloat(precio),
    stock: parseInt(stock),
  }
  productos.push(nuevoProducto)

  try {
    await fs.promises.writeFile(
      productosPath,
      JSON.stringify(productos, null, 2),
      'utf-8'
    )
  } catch (err) {
    throw err
  }

  return nuevoProducto
}

// Editar un producto existente
const editarProducto = async (id, { nombre, categoria, precio, stock }) => {
  const productos = await obtenerProductos()
  const productoIndex = productos.findIndex((p) => p.id === parseInt(id))

  if (productoIndex !== -1) {
    productos[productoIndex].nombre = nombre
    productos[productoIndex].categoria = categoria
    productos[productoIndex].precio = parseFloat(precio)
    productos[productoIndex].stock = parseInt(stock)

    await fs.promises.writeFile(
      productosPath,
      JSON.stringify(productos, null, 2),
      'utf-8'
    )
    return productos[productoIndex]
  } else {
    throw new Error('Producto no encontrado')
  }
}

// Eliminar un producto
const eliminarProducto = async (id) => {
  const productos = await obtenerProductos()
  const productosFiltrados = productos.filter((p) => p.id !== parseInt(id))

  try {
    await fs.promises.writeFile(
      productosPath,
      JSON.stringify(productosFiltrados, null, 2),
      'utf-8'
    )
  } catch (err) {
    console.log(err)
  }

  return
}

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
}
