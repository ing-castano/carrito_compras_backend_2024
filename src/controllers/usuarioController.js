const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')

const usuariosPath = path.join(__dirname, '../models/usuarios.json')

// Función para obtener todos los usuarios desde el archivo JSON
const obtenerTodos = async () => {
  try {
    const data = await fs.promises.readFile(
      path.join(__dirname, '../models/usuarios.json'),
      'utf-8'
    )
    return JSON.parse(data)
  } catch (err) {
    console.error('Error al leer usuarios:', err)
    return [] // Retorna un array vacío si no hay usuarios o si ocurre un error
  }
}

// Función para verificar usuario
const verificarUsuario = async (usuario) => {
  const users = await obtenerTodos() // Asegúrate de usar await aquí

  // Encuentra al usuario con el nombre de usuario correspondiente
  const userEncontrado = users.find(
    (user) => user.username === usuario.username
  )
  if (!userEncontrado) {
    return null // Usuario no encontrado
  }

  // Verificar la contraseña usando bcrypt
  const esValida = await bcrypt.compare(
    usuario.password,
    userEncontrado.password
  )

  if (esValida) {
    return userEncontrado.id // Retorna el ID si la contraseña es correcta
  } else {
    return null // Contraseña incorrecta
  }
}

const registrarUsuario = async ({ username, password, email, isAdmin = false }) => {
  // Verificar que usario no exista
  const users = await obtenerTodos()
  // Encuentra al usuario con el nombre de usuario correspondiente
  const userEncontrado = users.find((user) => user.username === username)
  if (userEncontrado) {
    const error = new Error('Usuario ya registrado')
    error.status = 400
    throw error
  }

  // Encriptar la contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(password, 10)

  // Generar nuevo id
  const id =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1

  // Crear nuevo usuario
  const nuevoUsuario = { id, username, password: hashedPassword, email, isAdmin }

  // Agregar el nuevo usuario a la lista de usuarios
  users.push(nuevoUsuario)

  // Escribir el nuevo arreglo de usuarios en el archivo JSON
  try {
    await fs.promises.writeFile(
      path.join(__dirname, '../models/usuarios.json'),
      JSON.stringify(users, null, 2), // Convertir a JSON con formato legible
      'utf-8'
    )
    return nuevoUsuario // Retorna el nuevo usuario registrado
  } catch (err) {
    const error = new Error('Error al escribir en la base de datos')
    error.status = 500
    throw error
  }
}


// Editar un usuario existente
const editarUsuario = async (id, { username, email }) => {
  const usuarios = await obtenerTodos();
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));

  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex].username = username;
    usuarios[usuarioIndex].email = email;

    await fs.promises.writeFile(usuariosPath, JSON.stringify(usuarios, null, 2), 'utf-8');
    return usuarios[usuarioIndex];
  } else {
    throw new Error('Usuario no encontrado');
  }
};

// Eliminar un usuario
const eliminarUsuario = async (id) => {
  const usuarios = await obtenerTodos();
  const usuariosFiltrados = usuarios.filter(u => u.id !== parseInt(id));

  await fs.promises.writeFile(usuariosPath, JSON.stringify(usuariosFiltrados, null, 2), 'utf-8');
  return;
};

module.exports = {
  obtenerTodos,
  verificarUsuario,
  registrarUsuario,
  editarUsuario,
  eliminarUsuario,
}
