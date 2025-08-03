
const Rutas = require('express').Router();
const controladorComandaItem = require('../controllers/comandaItem.controller');

// CRUD

// R  Read
Rutas.get('/', controladorComandaItem.obtenerTodos );
Rutas.get('/:id', controladorComandaItem.obtenerUno );

// C Create
Rutas.post('/', controladorComandaItem.crear );
// U Update
Rutas.put('/:id', controladorComandaItem.actualizar );
// D Delete
Rutas.delete('/:id', controladorComandaItem.eliminar );

module.exports = Rutas;

