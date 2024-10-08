const express = require('express')
const router = express.Router()
const { verificarUsuario } = require('../controllers/usuarioController')
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {
  const { username, password } = req.body
  const resultado = await verificarUsuario({ username, password })

  if (resultado) {
    console.log(process.env.JWT_SECRET)
    // Generar un token JWT
    const token = jwt.sign({ id: resultado }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Usuario verificado', id: resultado, token: token })
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' })
  }
})

module.exports = router
