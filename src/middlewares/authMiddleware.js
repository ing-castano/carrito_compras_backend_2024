const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

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
const verificarAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.log('Token no encontrado.');
      return res.redirect('/login'); // Redirige al login si no hay token
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log('Token inválido o expirado.');
      return res.redirect('/login'); // Token inválido
    }

    const usuarioId = decoded.id; // Extrae el ID del usuario desde el token

    // Buscar usuario en la base de datos
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      console.log(`Usuario con ID ${usuarioId} no encontrado.`);
      return res.status(403).send('Acceso denegado. Usuario no encontrado.');
    }

    if (!usuario.isAdmin) {
      console.log(`Usuario ${usuarioId} no tiene permisos de administrador.`);
      return res.status(403).send('Acceso denegado. Solo para administradores.');
    }

    // Almacena el usuario en la request para uso posterior
    req.usuario = usuario;
    next();
  } catch (err) {
    console.error('Error en verificarAdmin:', err);
    res.status(500).send('Error interno al verificar permisos de administrador.');
  }
};

module.exports = {
  verificarToken,
  protegerRutasPrivadas,
  firmarToken,
  verificarAdmin 
};
