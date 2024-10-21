const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController.js')
const { firmarToken } = require('../middlewares/authMiddleware')

router.get('/', (req, res, next) => {
  if (req.usuarioId) {
    return res.redirect('/')
  }
  res.render('register')
})

router.post('/', async (req, res, next) => {
  const { username, password, email } = req.body

  // Verificar que ningún campo esté vacío
  if (!username || !password || !email) {
    const error = new Error('Bad Request. Todos los campos son requeridos.')
    error.status = 400
    return next(error)
  }

  try {
    // Llamar al controlador para registrar el nuevo usuario
    const nuevoUsuario = await usuarioController.registrarUsuario({
      username,
      password,
      email,
    })
    req.usuarioId = nuevoUsuario.id
    firmarToken(req, res, () => {
      return res.redirect('/') // Redirigir después de firmar el token
    })
  } catch (err) {
    // Manejar el error de registro
    err.status = err.status || 500
    return next(err)
  }
})

module.exports = router
