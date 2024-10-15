const fs = require('fs')
const path = require('path')
const express = require('express')
const Carrito = require('../models/carrito')
const router = express.Router()

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

// Un diccionario en memoria para almacenar carritos por usuario
const carritos = {}

// Ruta para agregar productos al carrito
router.post('/agregar', async (req, res) => {
  const usuarioId = req.usuarioId

  // Si el carrito del usuario no existe, crear uno nuevo
  if (!carritos[usuarioId]) {
    carritos[usuarioId] = new Carrito()
  }

  const { cantidad, productoId } = req.body
  const productos = await obtenerProductos()
  const producto = productos.find((producto) => productoId == producto.id)

  // Agregar el producto al carrito
  carritos[usuarioId].agregarProducto(producto, cantidad)

  return res.redirect('/productos')
  //res.json({
  //message: 'Producto agregado al carrito',
  //carrito: carritos[usuarioId].mostrarCarrito(),
  // })
})

// Ruta para mostrar el carrito
router.get('/', (req, res) => {
  const usuarioId = req.usuarioId

  // Verificar si el carrito del usuario existe
  if (carritos[usuarioId]) {
    res.render('carrito', { pedidos: carritos[usuarioId].mostrarCarrito() })
    //res.json({ carrito: carritos[usuarioId].mostrarCarrito() })
  } else {
    res.render('carrito')
   // res.json({ carrito: [] })
  }
})

// Ruta para vaciar el carrito
router.post('/vaciar', (req, res) => {
  const usuarioId = req.usuarioId

  if (carritos[usuarioId]) {
    carritos[usuarioId].vaciarCarrito()
    res.render('carrito')
  } else {
    res.render('carrito', { pedidos: carritos[usuarioId].mostrarCarrito() })
  }
})

module.exports = router
