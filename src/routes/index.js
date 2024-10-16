const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { obtenerProductos } = require('../controllers/productoController')

// Ruta para renderizar la vista de la página principal
router.get('/', (req, res) => {
  res.render('index')
})

// Ruta para mostrar productos con filtros
router.get('/productos', async (req, res) => {
  let { categoria, minPrecio, maxPrecio } = req.query
  let productos = []
  try {
    productos = await obtenerProductos()
  } catch (err) {
    productos = [] // En caso de error, productos será un array vacío
    err.status = err.status || 500
    return next(err)
  }
  let productosFiltrados = productos.filter(p => p.stock > 0); 

  // Filtrar por categoría
  if (categoria) {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
    )
  }

  // Filtrar por rango de precio
  if (minPrecio) {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.precio >= parseFloat(minPrecio)
    )
  }
  if (maxPrecio) {
    productosFiltrados = productosFiltrados.filter(
      (p) => p.precio <= parseFloat(maxPrecio)
    )
  }

  // Renderizar vista con los productos filtrados
  res.render('index', { productos: productosFiltrados })
})

module.exports = router
