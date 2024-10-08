const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// Función para obtener todos los usuarios desde el archivo JSON
const obtenerTodos = async () => {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, '../data/usuarios.json'), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer usuarios:', err);
    return []; // Retorna un array vacío si no hay usuarios o si ocurre un error
  }
};

// Función para verificar usuario
const verificarUsuario = async (usuario) => {
  const users = await obtenerTodos(); // Asegúrate de usar await aquí
  console.log(users);

  // Encuentra al usuario con el nombre de usuario correspondiente
  const userEncontrado = users.find((user) => user.username === usuario.username);
  
  if (!userEncontrado) {
    return null; // Usuario no encontrado
  }

  // Verificar la contraseña usando bcrypt
  const esValida = await bcrypt.compare(usuario.password, userEncontrado.password);
  
  if (esValida) {
    return userEncontrado.id; // Retorna el ID si la contraseña es correcta
  } else {
    return null; // Contraseña incorrecta
  }
};

module.exports = {
    verificarUsuario
};
