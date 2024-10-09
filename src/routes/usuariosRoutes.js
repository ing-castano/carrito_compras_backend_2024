// usuariosRoutes.js
const express = require('express')
const router = express.Router()
const { verificarUsuario } = require('../controllers/usuarioController')
const jwt = require('jsonwebtoken')

// Ruta para renderizar la vista de la página principal
router.get('/', (req, res, next) => {
  if (req.usuarioId) {
    return res.redirect('/')
  }
  res.render('login')
})

router.post('/', async (req, res) => {
  const { username, password } = req.body
  const usuarioId = await verificarUsuario({ username, password })

  if (usuarioId != null) {
    // Generar un token JWT
    const token = jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    res.cookie('token', token) // Configura la cookie
    return res.status(200).redirect('/') // Redirigir a la página principal
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' })
  }
})

module.exports = router
