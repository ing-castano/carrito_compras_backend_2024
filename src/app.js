// Archivo principal del proyecto
require('dotenv').config() // Cargar las variables de entorno
const express = require('express')
const cookieParser = require('cookie-parser') // Necesario para leer las cookies
const app = express()
const indexRoutes = require('./routes/index.js')
const usuariosRoutes = require('./routes/usuariosRoutes.js')
const path = require('path')
const { verificarToken } = require('./middlewares/authMiddleware.js')

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser()) // Para que el middleware pueda acceder a las cookies

// Rutas públicas
app.use('/login', verificarToken, usuariosRoutes)

// Rutas privadas
app.use('/', verificarToken, indexRoutes)

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
