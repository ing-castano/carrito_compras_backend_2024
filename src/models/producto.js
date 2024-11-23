const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true },
  nombre: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;
