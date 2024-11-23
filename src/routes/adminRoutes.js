const express = require('express')
const router = express.Router()
const { verificarAdmin } = require('../middlewares/authMiddleware')
const {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  obtenerCategorias,
} = require('../controllers/productoController')
const {
  obtenerTodos: obtenerUsuarios,
  editarUsuario,
  eliminarUsuario,
} = require('../controllers/usuarioController')

// Ruta del panel de administración
router.get('/', verificarAdmin, async (req, res) => {
  try {
    const productos = await obtenerProductos()
    const usuarios = await obtenerUsuarios()
    const categorias = await obtenerCategorias();
    console.log(categorias);
    res.render('panelAdmin', { productos, usuarios, categorias })
  } catch (err) {
    res.status(500).send('Error al cargar datos')
  }
})



// Rutas para CRUD de productos
router.post('/producto/agregar', verificarAdmin, async (req, res) => {
  try {
    await agregarProducto(req.body)
    res.redirect('/admin')
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).send('Error al agregar producto')
  }
})

router.post('/producto/:id/editar', verificarAdmin, async (req, res) => {
  try {
    await editarProducto(req.params.id, req.body)
    res.redirect('/admin')
  } catch (err) {
    res.status(500).send('Error al editar producto')
  }
})

router.get('/producto/:id/eliminar', verificarAdmin, async (req, res) => {
  try {
    await eliminarProducto(req.params.id)
    res.redirect('/admin')
  } catch (err) {
    res.status(500).send('Error al eliminar producto')
  }
})

// Rutas para CRUD de usuarios
router.post('/usuario/:id/editar', verificarAdmin, async (req, res) => {
  try {
    await editarUsuario(req.params.id, req.body)
    res.redirect('/admin')
  } catch (err) {
    res.status(500).send('Error al editar usuario')
  }
})

router.get('/usuario/:id/eliminar', verificarAdmin, async (req, res) => {
  try {
    await eliminarUsuario(req.params.id)
    res.redirect('/admin')
  } catch (err) {
    res.status(500).send('Error al eliminar usuario')
  }
})

module.exports = router
