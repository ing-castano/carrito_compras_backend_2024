const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ruta para renderizar la vista de la página principal
router.get('/', (req, res) => {
  res.render('index');
});


// Cargar productos desde productos.json
const productosPath = path.join(__dirname, '../models/productos.json');
let productos;

// Verifica que el archivo JSON exista y cargue los productos
try {
  productos = JSON.parse(fs.readFileSync(productosPath, 'utf-8'));
} catch (error) {
  console.error('Error al cargar productos:', error);
  productos = [];  // En caso de error, productos será un array vacío
}

// Ruta para mostrar productos con filtros
router.get('/productos', (req, res) => {
  let { categoria, minPrecio, maxPrecio } = req.query;
  let productosFiltrados = productos;

  // Filtrar por categoría
  if (categoria) {
    productosFiltrados = productosFiltrados.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
  }

  // Filtrar por rango de precio
  if (minPrecio) {
    productosFiltrados = productosFiltrados.filter(p => p.precio >= parseFloat(minPrecio));
  }
  if (maxPrecio) {
    productosFiltrados = productosFiltrados.filter(p => p.precio <= parseFloat(maxPrecio));
  }

  // Renderizar vista con los productos filtrados
  res.render('index', { productos: productosFiltrados });
});

module.exports = router;