const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { obtenerProductos, obtenerCategorias } = require('../controllers/productoController');


// Ruta para renderizar la vista de la página principal
router.get('/', async (req, res, next) => {
  try {
    const categorias = await obtenerCategorias(); // Esta función debe devolver las categorías desde tu base de datos
    res.render('index', { categorias, productos: [] });
  } catch (error) {
    error.status = error.status || 500;
    next(error); // Pasa el error al manejador de errores
  }
});


// Ruta para mostrar productos con filtros
router.get('/productos', async (req, res, next) => {
  let { categoria, minPrecio, maxPrecio } = req.query

  try {
    const categorias = await obtenerCategorias();
    productos = await obtenerProductos()
    let productosFiltrados = productos.filter(p => p.stock > 0); 

  // Filtrar por categoría
  if (categoria && categoria !== '') {
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
  res.render('index', { productos: productosFiltrados, categorias: categorias  })

} catch (err) {
  productos = [] // En caso de error, productos será un array vacío
  err.status = err.status || 500
  return next(err)
}
})

module.exports = router
