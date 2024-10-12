class Pedido {
  constructor(producto, cantidad) {
    this.producto = producto // Objeto de la clase Producto
    this.cantidad = cantidad // Cantidad del producto agregado al carrito
  }

  // Método para calcular el total del pedido (producto * cantidad)
  calcularTotal() {
    return this.producto.precio * this.cantidad
  }
}

module.exports = Pedido
