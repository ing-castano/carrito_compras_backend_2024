const mongoose = require('mongoose');
const express = require('express')
const Carrito = require('../models/carrito')
const Producto = require('../models/producto');
const PedidoModel = require('../models/pedido');
const router = express.Router()
const carritos = {}

// Se modifico el metodo para obtener los productos de la base de datos en lugar del archivo json como estaba anteriormente
const obtenerProductos = async () => {
  try {
    return await ProductoModel.find();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error
  }
}

// Ruta para AGREGAR UN PRODUCTO AL CARRITO
// Tambien se modifico y captura el id del producto desde la base de datos en lugar del archivo json como estaba antes
router.post('/agregar', async (req, res) => {
  const { cantidad, productoId } = req.body;

  try {
    const producto = await Producto.findOne({ id: productoId });

    if (!producto) {
      return res.status(404).send('Producto no encontrado.');
    }

    if (producto.stock < cantidad) {
      return res.status(400).send('No hay suficiente stock disponible.');
    }

    const usuarioId = req.usuarioId || 'defaultUser';
    if (!carritos[usuarioId]) {
      carritos[usuarioId] = new Carrito(); 
    }

    carritos[usuarioId].agregarProducto(producto, cantidad);

    // Actualizar stock del producto, es decir hace una modificacion en la base de datos al stock actual
    producto.stock -= cantidad;
    await producto.save();

    res.redirect('/productos');
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error al agregar producto al carrito.');
  }
});


// Ruta para mostrar el carrito
router.get('/', (req, res) => {
  const usuarioId = req.usuarioId || 'defaultUser';

  if (carritos[usuarioId]) {
    const pedidos = carritos[usuarioId].mostrarCarrito();
    res.render('carrito', { pedidos });
  } else {
    res.render('carrito', { pedidos: [] }); // No hay productos
  }
});


// POST Ruta para vaciar el carrito
router.post('/vaciar', (req, res) => {
  const usuarioId = req.usuarioId || 'defaultUser';

  if (carritos[usuarioId]) {
    carritos[usuarioId].vaciarCarrito();
  }

  res.render('carrito', { pedidos: [] });
});



//FINALIZAR EL CARRITO

router.post('/finalizar', async (req, res) => {
  const usuarioId = req.usuarioId || 'defaultUser';

  try {

    const productos = carritos[usuarioId].mostrarCarrito();

    // Calcula el total de la compra
    const total = productos.reduce((acc, prod) => acc + prod.total, 0);

    // Genera el número de pedido
    const numeroPedido = await PedidoModel.countDocuments() + 1;

    // Crea el pedido en la base de datos
    const nuevoPedido = new PedidoModel({
      numeroPedido,
      total,
      productos,
    });

    await nuevoPedido.save();

    // Vacía el carrito después de finalizar la compra
    carritos[usuarioId].vaciarCarrito();

    // redirige a productos
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    res.status(500).send('Error al finalizar la compra.');
  }
});


module.exports = router
