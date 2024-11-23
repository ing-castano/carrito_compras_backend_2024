require('dotenv').config()
const mongoose = require('mongoose')
const usuariosJSON = require('../src/models/usuarios.json') // Ruta al archivo JSON
const Usuario = require('../src/models/usuario')
// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((error) => {
    console.log('Error al conectar con MongoDB:', error)
  })

// Función para insertar productos en la base de datos
async function migrarUsuarios() {
  try {
    // Limpiar la colección de productos (si quieres borrar los existentes antes de insertar nuevos)
    await Usuario.deleteMany({})

    // Insertar los productos
    const usuarios = await Usuario.insertMany(usuariosJSON)
    console.log('Usuarios migrados con éxito:', usuarios)
    mongoose.connection.close()
  } catch (error) {
    console.error('Error al migrar los productos:', error)
    mongoose.connection.close()
  }
}

// Ejecutar la migración
migrarUsuarios()
