const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

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

// Verifica si el usuario tiene permisos de administrador
const verificarAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.redirect('/login'); // Redirige al login si no hay token
  }

  // Verificar token y extraer usuario
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.redirect('/login'); // Si el token es inválido, redirige al login
    }

    const usuarioId = decoded.id; // Extrae el ID del usuario desde el token

    // Cargar usuarios desde archivo JSON
    fs.promises.readFile(path.join(__dirname, '../models/usuarios.json'), 'utf-8')
      .then(data => {
        const usuarios = JSON.parse(data);
        const usuario = usuarios.find(u => u.id === usuarioId);

        if (!usuario || !usuario.isAdmin) {
          return res.status(403).send('Acceso denegado. Solo para administradores.');
        }

        // Almacena el usuario en la request
        req.usuario = usuario;
        next(); // Si es administrador, permite el acceso
      })
      .catch(err => {
        return res.status(500).send('Error al verificar usuario.');
      });
  });
};

module.exports = {
  verificarToken,
  protegerRutasPrivadas,
  firmarToken,
  verificarAdmin 
};
