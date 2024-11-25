const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Producto = require('../models/producto')

// Función para obtener todos los productos desde el archivo JSON
const obtenerProductos = async () => {
  try {
   return await Producto.find();
  } catch (error) {
    console.error("Error al obtener productos de MongoDB:", error);
    throw new Error("No se pudieron cargar los productos desde la base de datos");
  }
};

//Generar Id del nuevo producto
const generarIdProducto = async () => {
  const ultimoProducto = await Producto.findOne().sort({ id: -1 });
  console.log(ultimoProducto)
  return ultimoProducto ? ultimoProducto.id + 1 : 1;
};
// Agregar un nuevo producto

const agregarProducto = async (productoData) => {
  try {
    const { nombre, categoria, nuevaCategoria, precio, stock } = productoData;

    //si seleccionó "Otra categoría"
    const categoriaFinal = categoria === 'otra' ? nuevaCategoria : categoria;
    console.log('Datos recibidos:', productoData);


    const nuevoId = await generarIdProducto(); // generar un id 
    const nuevoProducto = new Producto({ 
      nombre, 
      categoria: categoriaFinal, 
      precio: parseFloat(precio), 
      stock: parseInt(stock), 
      id: nuevoId 
    });

    await nuevoProducto.save();
  } catch (err) {
    throw new Error('Error al agregar producto: ' + err.message);
  }
};



// Editar un producto existente
const editarProducto = async (id, { nombre, categoria, precio, stock }) => {
  try {
    const producto = await Producto.findOneAndUpdate(
      { id: id }, // Busca por el campo `id` (tipo Number)
      {
        nombre,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    return producto;
  } catch (err) {
    console.error('Error al editar producto:', err.message);
    throw new Error('Error al editar el producto');
  }
};


// Eliminar un producto
const eliminarProducto = async (id) => {
  try {
    const productoEliminado = await Producto.findOneAndDelete({ id: id });

    if (!productoEliminado) {
      throw new Error('Producto no encontrado');
    }

    return productoEliminado; // Retorna el producto eliminado si es necesario
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    throw new Error('Error al eliminar el producto');
  }
};


// Obtener las categorias de los productos
const obtenerCategorias = async () => {
  try {
    const categorias = await Producto.distinct("categoria");
    return categorias;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw new Error("No se pudieron cargar las categorías");
  }
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  obtenerCategorias,
}
