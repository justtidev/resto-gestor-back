
const Rutas = require('express').Router();
const controladorMenuItem = require('../controllers/menuItem.controller');

// CRUD

// R  Read
Rutas.get('/', controladorMenuItem.obtenerTodos );
Rutas.get('/lista', controladorMenuItem.lista)
Rutas.get('/:id', controladorMenuItem.obtenerUno );
// Rutas.get('/ofertas/', controladorMenuItem.ofertas );
// C Create
Rutas.post('/', controladorMenuItem.crear );
// U Update
Rutas.put('/:id', controladorMenuItem.actualizar );
// D Delete
Rutas.delete('/:id', controladorMenuItem.eliminar );

module.exports = Rutas;

