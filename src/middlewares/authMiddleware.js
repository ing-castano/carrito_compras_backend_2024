const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return next() // Si no hay token, continuar
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect('/login') // Redirigir si el token es inválido
    }

    req.usuarioId = decoded.id // Almacenar el ID del usuario en la solicitud
    next() // Continuar al siguiente middleware
  })
}

module.exports = {
  verificarToken,
}
