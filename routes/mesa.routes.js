
const Rutas = require('express').Router();
const controladorMesa = require('../controllers/mesa.controller');

// CRUD

// R  Read
Rutas.get('/', controladorMesa.obtenerTodos );
Rutas.get('/:id', controladorMesa.obtenerUno );

// C Create
Rutas.post('/', controladorMesa.crear );
// U Update
Rutas.put('/:id', controladorMesa.actualizar );
// D Delete
Rutas.delete('/:id', controladorMesa.eliminar );

module.exports = Rutas;

