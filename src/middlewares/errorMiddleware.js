// middlewares/errorMiddleware.js
const errorMiddleware = (req, res, next) => {
  const error = new Error() // Crea un nuevo error
  error.message = 'La página no ha sido encontrada' // Mensaje de error
  error.status = 404 // Estado HTTP 404
  next(error) // Pasa el error al siguiente middleware de manejo de errores
}

// Middleware de manejo de errores
const handleError = (err, req, res, next) => {
  const status = err.status || 500 // Usa el estado del error o 500 por defecto
  const message = err.message || 'Ocurrió un error interno' // Mensaje de error por defecto

  // Renderiza la vista de error con el mensaje y el código de estado
  res.status(status).render('error', { status, message })
}

module.exports = { errorMiddleware, handleError }
