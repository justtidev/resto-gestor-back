
const Rutas = require('express').Router();
const controladorComanda = require('../controllers/comanda.controller');

// CRUD

// R  Read
Rutas.get('/', controladorComanda.obtenerTodos );
Rutas.get('/activas', controladorComanda.obtenerActivas );
Rutas.get("/mesa/:mesaId", controladorComanda.obtenerComandaPorMesa);
Rutas.get("/comanda-activa/:mesaId", controladorComanda.obtenerComandaConfirmadaPorMesa);


Rutas.get('/:id', controladorComanda.obtenerUno );


// C Create
Rutas.post('/', controladorComanda.crear );
// U Update
Rutas.put('/:id', controladorComanda.actualizar );
Rutas.put("/:id/asignar-a-humano", controladorComanda.asignarMozo);
// D Delete
Rutas.delete('/:id', controladorComanda.eliminar );

module.exports = Rutas;

