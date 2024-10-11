const express = require('express')
const router = express.Router()
const { verificarToken } = require('../middlewares/authMiddleware')

// Ruta para cerrar sesión
router.get('/', (req, res) => {
  res.clearCookie('token') // Eliminar la cookie
  return res.redirect('/login')
})

module.exports = router
