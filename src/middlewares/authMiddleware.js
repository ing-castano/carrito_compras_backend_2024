const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const token = req.cookies?.token
  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      // Si el token es válido, almacenar el ID del usuario y continuar al siguiente middleware
      req.usuarioId = decoded.id
    }
  })
  next()
}

const protegerRutasPrivadas = (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    return res.render('login')
  }
  next()
}

const firmarToken = (req, res, next) => {
  // Generar un token JWT
  const token = jwt.sign({ id: req.usuarioId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Duración del token
  })
  res.cookie('token', token) // Configura la cookie
  next()
}

module.exports = {
  verificarToken,
  protegerRutasPrivadas,
  firmarToken,
}
