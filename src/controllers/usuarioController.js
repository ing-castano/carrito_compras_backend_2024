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
const verificarUsuario = async ({ username, password }) => {
  try {
    const usuarioEncontrado = await Usuario.findOne({ username })

    if (!usuarioEncontrado) {
      return null // Usuario no encontrado
    }

    // Verificar la contraseña usando bcrypt
    const esValida = await bcrypt.compare(password, usuarioEncontrado.password)
    if (esValida) {
      return usuarioEncontrado._id // Retorna el ID si la contraseña es correcta
    } else {
      return null // Contraseña incorrecta
    }
  } catch (err) {
    console.error('Error al verificar usuario:', err)
    throw new Error('Error al verificar usuario')
  }
}

const registrarUsuario = async ({
  username,
  password,
  email,
  isAdmin = false,
}) => {
  try {
    // Verificar que usario no exista
    const usuarioExistente = await Usuario.findOne({
      $or: [{ username }, { email }],
    })
    if (usuarioExistente) {
      const error = new Error('Usuario ya registrado')
      error.status = 400
      throw error
    }

    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({
      username,
      password: hashedPassword,
      email,
    })

    // Guarda el nuevo usuario en la base de datos
    const usuarioGuardado = await nuevoUsuario.save()
    // Retorna el nuevo usuario registrado
    return usuarioGuardado
  } catch (err) {
    const error = new Error('Error al escribir en la base de datos')
    error.status = 500
    throw error
  }
}

// Editar un usuario existente
const editarUsuario = async (id, { username, email }) => {
  try {
    // Busca y actualiza el usuario por ID
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { username, email },
      { new: true, runValidators: true } // Retorna el documento actualizado y valida los datos
    )

    if (!usuarioActualizado) {
      throw new Error('Usuario no encontrado')
    }
    return usuarioActualizado
  } catch (err) {
    throw new Error('Error al editar usuario')
  }
}

// Eliminar un usuario
const eliminarUsuario = async (id) => {
  try {
    // Elimina el usuario por ID
    const usuarioEliminado = await Usuario.findByIdAndDelete(id)
    if (!usuarioEliminado) {
      throw new Error('Usuario no encontrado')
    }
    return
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
    throw new Error('Error al eliminar usuario')
  }
}

module.exports = {
  obtenerTodos,
  verificarUsuario,
  registrarUsuario,
  editarUsuario,
  eliminarUsuario,
}
