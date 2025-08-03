
// routes/aiRoutes.js
const Rutas = require('express').Router();
const aiController = require('../controllers/ai.controller');

// Definimos una ruta POST para /ask
// Se espera que la pregunta venga en el body de la petición como JSON: { "question": "Tu pregunta aquí" }
Rutas.post('/ask', aiController.askQuestion);
Rutas.post('/ask-and-create', aiController.askAndCreateComanda)
Rutas.post('/reset-chat', aiController.resetChat);
Rutas.put('/ia/:id', aiController.agregarProductosIA);
/* // R  Read
Rutas.get('/', controladorCategoria.obtenerTodos );
Rutas.get('/:id', controladorCategoria.obtenerUno );
// Rutas.get('/ofertas/', controladorProducto.ofertas );
// C Create
Rutas.post('/', controladorCategoria.crear );
// U Update
Rutas.put('/:id', controladorCategoria.actualizar );
// D Delete
Rutas.delete('/:id', controladorCategoria.eliminar ); */

module.exports = Rutas;

