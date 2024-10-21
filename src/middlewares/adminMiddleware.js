const verificarAdmin = (req, res, next) => {
    const { usuario } = req; 
  
    if (usuario && usuario.isAdmin === true) { 
      return next(); 
    } else {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  };
  
  module.exports = verificarAdmin;
  