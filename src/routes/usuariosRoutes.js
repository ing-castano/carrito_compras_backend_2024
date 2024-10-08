const express = require('express')
const router = express.Router()
const { verificarUsuario } = require('../controllers/usuarioController')

router.post('/', async (req, res) => {
  const { username, password } = req.body
  const resultado = await verificarUsuario(userInput)
  if (resultado) {
    res.status(200).json({ message: 'Usuario verificado', id: resultado })
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' })
  }
})

module.exports = router
