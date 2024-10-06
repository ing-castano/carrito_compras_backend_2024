const express = require('express');
const router = express.Router();

// Ruta para renderizar la vista de la página principal
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
