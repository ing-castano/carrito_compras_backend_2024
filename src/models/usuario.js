const mongoose = require('mongoose')

// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Asegura que el nombre de usuario sea único
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Asegura que el correo electrónico sea único
      trim: true,
      match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido'], // Validación básica de email
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Define una longitud mínima para la contraseña
    },
    isAdmin: {
      type: Boolean,
      default: false, // Por defecto, no es administrador
    },
  },
  { timestamps: true }
) // timestamps añade automáticamente campos createdAt y updatedAt

// Crear el modelo a partir del esquema
const Usuario = mongoose.model('Usuario', usuarioSchema)

module.exports = Usuario
