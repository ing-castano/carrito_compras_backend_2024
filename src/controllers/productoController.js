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

module.exports = {
  obtenerProductos,
}
