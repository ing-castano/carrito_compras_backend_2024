const express = require('express')
const router = express.Router()
const { verificarUsuario } = require('../controllers/usuarioController')
const { firmarToken, verificarToken } = require('../middlewares/authMiddleware')
const jwt = require('jsonwebtoken')

// Ruta para renderizar la vista de la página principal
router.get('/', (req, res, next) => {
  if (req.usuarioId) {
    return res.redirect('/productos')
  }
  res.render('login')
})

router.post('/', async (req, res, next) => {
  const { username, password } = req.body
  const usuarioId = await verificarUsuario({ username, password })

  if (usuarioId != null) {
    req.usuarioId = usuarioId
    firmarToken(req, res, () => {
      return res.status(200).redirect('/productos') // Redirigir a la página principal despues de firmar el token
    })
  } else {
    const error = new Error('Credenciales incorrectas')
    error.status = 401 // Establece el estado
    next(error) // Pasa el error al siguiente middleware de manejo de errores
  }
})

module.exports = router
