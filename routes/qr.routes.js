const express = require("express");
const Rutas = express.Router();
const qrController = require("../controllers/qr.controller");

Rutas.get("/qr/:mesaId", qrController.generarQR);

module.exports = Rutas;
