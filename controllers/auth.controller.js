const db = require("../models/index");
const bcrypt = require("bcrypt");
const {  verifyUser, generateAccessToken, registerUser } = require("./auth.service");
const jwt = require('jsonwebtoken');
const { response } = require("express");
const refreshTokens = [];
// Registro de usuario

async function register(req, res) {
const { usuario, nombre, apellido, email, contraseña, RolId } = req.body;
  console.log("datos recibidos", usuario, nombre, apellido, email, contraseña, RolId);
  // Validar que todos los campos requeridos estén presentes

  try {
   
    // Crear el nuevo usuario
    const nuevoUsuario = await registerUser( usuario, nombre, apellido, email, contraseña, RolId);

    res.status(201).json({
      ok: true,
      status: 201,
      message: "Usuario creado con éxito",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error en el registro",
      error: error.message
    });
  }
}

/* function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
} */

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}


// Inicio de sesión (Login)
async function login(req, res) {
  const { usuario, contraseña } = req.body;

  try {
    // Buscar el usuario por usuario
    const user = await verifyUser(usuario,contraseña)
     // Genera los tokens de acceso y refresh
     console.log("usuario encontrado despues de verify", user);
      
    const plainUser= {
      id: user.id, 
      nombre: user.nombre,
      RolId: user.RolId,  
    } 
  const accessToken = generateAccessToken({ user: plainUser });
const refreshToken = generateRefreshToken({ user: plainUser });

return res.status(200).json({
  ok: true,
  accessToken,
  refreshToken
});
 }
    // Verificar si el usuario existe y si la clave es correcta
  catch(error) {
     console.error("1 :", error.message);  
    return res. status(401).json({
      ok: false,
      message: "Credenciales incorrectas",
      error: error.message
    });
    // Aquí puedes manejar el error, por ejemplo, enviando una respuesta de error
    // res.status(401).json({ message: "Credenciales incorrectas" });
    // Puedes lanzar un error o enviar una respuesta de error
  // Si las credenciales son incorrectas
    }
    
    
 
}




// Controlador para refrescar el token
function refreshToken(req, res) {
  const { token } = req.body;

  if (!token)
    return res.status(401).json({ message: "Token requerido" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token inválido" });

    const plainUser = decoded.user;

    const accessToken = generateAccessToken({ user:plainUser });
    res.json({ accessToken });
  });
}








module.exports = {
  register,
  login,
  refreshToken
};
