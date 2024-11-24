const Pedido = require('./pedido');

class Carrito {
  constructor() {
    this.productos = []; // Array que almacena los pedidos (items del carrito)
  }

  // Método para agregar un producto al carrito
  agregarProducto(producto, cantidad) {
    const productoExistente = this.productos.find(item => item.producto.id === producto.id);
    
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      if (cantidad > producto.stock) {
        throw new Error(`No hay suficiente stock para el producto ${producto.nombre}`);
      }
    this.productos.push({ producto, cantidad: Number(cantidad) });
    }
  }

  // Método para calcular el total del carrito
  calcularTotalCarrito() {
    return this.productos.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  // Método para vaciar el carrito
  vaciarCarrito() {
    this.productos = [];
  }

  // Método para mostrar los productos en el carrito
  mostrarCarrito() {
    return this.productos.map(item => ({
      id: item.producto.id,
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      precio: item.producto.precio,
      total: item.producto.precio * item.cantidad
    }));
  }
}

module.exports = Carrito;
