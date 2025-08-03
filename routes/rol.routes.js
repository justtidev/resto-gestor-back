
const Rutas = require('express').Router();
const controladorRol = require('../controllers/rol.controller');

// CRUD

// R  Read
Rutas.get('/', controladorRol.obtenerTodos );
Rutas.get('/:id', controladorRol.obtenerUno );

// C Create
Rutas.post('/', controladorRol.crear );
// U Update
Rutas.put('/:id', controladorRol.actualizar );
// D Delete
Rutas.delete('/:id', controladorRol.eliminar );

module.exports = Rutas;

