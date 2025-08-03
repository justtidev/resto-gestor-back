const express = require('express');
const Rutas = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../auth/auth.middleware');

// Ruta para login
Rutas.post('/login' ,authController.login);

// Ruta para refrescar token
Rutas.post('/refresh', authController.refreshToken);

// Ruta para registrar usuario
Rutas.post('/register', authenticateToken, authController.register);


module.exports = Rutas;

