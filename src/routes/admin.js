// routes/admin.js
const express = require('express');
const router = express.Router();
const { protegerRutasAdmin } = require('../middlewares/authMiddleware');
const { obtenerProductos, agregarProducto, editarProducto, eliminarProducto } = require('../controllers/productoController');
const { obtenerTodos: obtenerUsuarios, editarUsuario, eliminarUsuario } = require('../controllers/usuarioController');

// Ruta del panel de administración
router.get('/admin', protegerRutasAdmin, async (req, res) => {
  try {
    const productos = await obtenerProductos();
    const usuarios = await obtenerUsuarios();
    // Aquí puedes cargar también los pedidos si están implementados
    res.render('panelAdmin', { productos, usuarios });
  } catch (err) {
    res.status(500).send('Error al cargar datos');
  }
});

// Rutas para CRUD de productos
router.post('/admin/producto/agregar', protegerRutasAdmin, async (req, res) => {
  try {
    await agregarProducto(req.body);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error al agregar producto');
  }
});

router.post('/admin/producto/:id/editar', protegerRutasAdmin, async (req, res) => {
  try {
    await editarProducto(req.params.id, req.body);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error al editar producto');
  }
});

router.get('/admin/producto/:id/eliminar', protegerRutasAdmin, async (req, res) => {
  try {
    await eliminarProducto(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error al eliminar producto');
  }
});

// Rutas para CRUD de usuarios
router.post('/admin/usuario/:id/editar', protegerRutasAdmin, async (req, res) => {
  try {
    await editarUsuario(req.params.id, req.body);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error al editar usuario');
  }
});

router.get('/admin/usuario/:id/eliminar', protegerRutasAdmin, async (req, res) => {
  try {
    await eliminarUsuario(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error al eliminar usuario');
  }
});

module.exports = router;
