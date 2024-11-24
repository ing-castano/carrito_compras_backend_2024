const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  numeroPedido: { type: Number, required: true, unique: true },
  total: { type: Number, required: true },
  estado: { type: String, default: 'Solicitado', enum: ['Solicitado', 'Procesado', 'Completado'] },
  fechaCreacion: { type: Date, default: Date.now },
  productos: [
    {
      nombre: String,
      cantidad: Number,
      precio: Number,
      total: Number,
    },
  ],
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

module.exports = Pedido;
