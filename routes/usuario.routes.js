
const Rutas = require('express').Router();
const controladorUsuario = require('../controllers/usuario.controller');
const { authenticateToken } = require('../auth/auth.middleware');

// CRUD

// R  Read
Rutas.get('/', authenticateToken, controladorUsuario.obtenerUsuarios );
Rutas.get('/:id', authenticateToken, controladorUsuario.obtenerUsuarioById );
// Rutas.get('/ofertas/', controladorProducto.ofertas );
// C Create
Rutas.post('/', authenticateToken, controladorUsuario.crearUsuario );
// U Update
Rutas.put('/:id',authenticateToken, controladorUsuario.actualizarUsuario );
// D Delete
Rutas.delete('/:id',authenticateToken, controladorUsuario.eliminarUsuario );
Rutas.post('/login', controladorUsuario.loginUsuario );
module.exports = Rutas;

