
const Rutas = require('express').Router();
const controladorCategoria = require('../controllers/categoria.controller');

// CRUD

// R  Read
Rutas.get('/', controladorCategoria.obtenerTodos );
Rutas.get('/:id', controladorCategoria.obtenerUno );
// Rutas.get('/ofertas/', controladorProducto.ofertas );
// C Create
Rutas.post('/', controladorCategoria.crear );
// U Update
Rutas.put('/:id', controladorCategoria.actualizar );
// D Delete
Rutas.delete('/:id', controladorCategoria.eliminar );

module.exports = Rutas;

