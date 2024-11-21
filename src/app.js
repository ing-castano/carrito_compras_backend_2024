// Archivo principal del proyecto
require('dotenv').config()// Cargar las variables de entorno
console.log('MONGO_URI:', process.env.MONGO_URI); 
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser') // Necesario para leer las cookies
const app = express()
const indexRoutes = require('./routes/index.js')
const loginRoutes = require('./routes/loginRoutes.js')
const logoutRoutes = require('./routes/logoutRoutes.js')
const registerRoutes = require('./routes/registerRoutes.js')
const carritoRoutes = require('./routes/carrito')
const adminRoutes = require('./routes/adminRoutes.js')

const path = require('path')
const {
  verificarToken,
  protegerRutasPrivadas,
} = require('./middlewares/authMiddleware.js')
const {
  errorMiddleware,
  handleError,
} = require('./middlewares/errorMiddleware.js')

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()) // Para que el middleware pueda acceder a las cookies

//Conexion a base de datos

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.log('Error al conectar con MongoDB:', error);
  });

// Rutas públicas
app.use('/login', verificarToken, loginRoutes)
app.use('/register', verificarToken, registerRoutes)

// Rutas privadas
app.use(protegerRutasPrivadas) // Middleware para proteger todas las rutas privadas
app.use('/', indexRoutes)
app.use('/admin', adminRoutes)
app.use('/logout', logoutRoutes)
app.use('/carrito', carritoRoutes)

// Ruta de error
app.use('/*', errorMiddleware, handleError)

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
