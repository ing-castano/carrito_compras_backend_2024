const Pedido = require('./pedido');

class Carrito {
  constructor() {
    this.pedidos = []; // Array que almacena los pedidos (items del carrito)
  }

  // Método para agregar un producto al carrito
  agregarProducto(producto, cantidad) {
    const pedidoExistente = this.pedidos.find(pedido => pedido.producto.id === producto.id);
    
    if (pedidoExistente) {
      pedidoExistente.cantidad += cantidad;
    } else {
      const nuevoPedido = new Pedido(producto, Number(cantidad));
      this.pedidos.push(nuevoPedido);
    }
  }

  // Método para calcular el total del carrito
  calcularTotalCarrito() {
    return this.pedidos.reduce((total, pedido) => total + pedido.calcularTotal(), 0);
  }

  // Método para vaciar el carrito
  vaciarCarrito() {
    this.pedidos = [];
  }

  // Método para mostrar los productos en el carrito
  mostrarCarrito() {
    return this.pedidos.map(pedido => ({
      nombre: pedido.producto.nombre,
      cantidad: pedido.cantidad,
      precio: pedido.producto.precio,
      total: pedido.calcularTotal()
    }));
  }
}

module.exports = Carrito;
