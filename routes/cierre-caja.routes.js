
const Rutas = require('express').Router();
const controladorCierreCaja = require('../controllers/cierreCaja.controller');

Rutas.get('/', controladorCierreCaja.obtenerComandasParaCierre );

Rutas.post('/', controladorCierreCaja.registrarCierre );
Rutas.get('/historico', controladorCierreCaja.obtenerHistoricoCierres); 

Rutas.delete('/:id', controladorCierreCaja.eliminarCierre);  

module.exports = Rutas;