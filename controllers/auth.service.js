const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { where, Op } = require("sequelize");
const db = require("../models/index");
// const usuario = db.usuario;

// Verifica el usuario y la contraseña
async function verifyUser(usuario, contraseña) {
  console.log("llega a verifyUser", usuario, contraseña);
const usuarioEncontrado = await db.usuario.findOne({ where: { usuario},
})
   

if (!usuarioEncontrado) {
    throw new Error("El usuario no existe");
  }
  console.log("user encontrado", usuarioEncontrado);
 console.log('Contraseña recibida del front:', `"${contraseña}"`);

  // Comparar la clave en texto plano con la clave encriptada
  console.log(typeof contraseña, contraseña);
  const contraseñaValida = await bcrypt.compare
  (contraseña, usuarioEncontrado.contraseña);
  //metodo compare retonra un booleano, true si la clave es correcta, false si no lo es
if (!contraseñaValida) {
  throw new Error("Contraseña incorrecta");
}
  console.log("contraseña valida", contraseñaValida);
  return usuarioEncontrado; // Retorna el usuario encontrado si las credenciales son correctas

}

// Genera un token de acceso: COmo una llave de acceso para el usuario
function generateAccessToken(data) {
  //el metodo sign de jwt recibe un objeto con los datos que queremos incluir en el token, una clave secreta y un objeto de opciones
  // El token expirará en 15 minutos
  console.log("data generateAccessToken", data)
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}

// Genera un token de acceso

async function registerUser(usuario) {
  console.log("llega a registerUser", usuario);
  // Verifica si el usuario ya existe
  const existingUser = await db.usuario.findOne({
    where: {
      usuario: usuario.usuario,
    },
  });
  console.log("existingUser ", existingUser)
  if (existingUser) {
    console.log("Ya existe", usuario);
    // Si el usuario ya existe, lanza un error
    throw new Error("El usuario ya existe"); 
  }
  

  // Encripta la contraseña. Hashear la clave antes de guardarla
  /*  el 10 es el "salt" que es un fragmento aleatorio que se usará para generar el hash asociado a la password, y se guardará junto con ella en la base de datos. Así se evita que dos passwords iguales generen el mismo hash y los problemas que ello conlleva, */
  const hashedContraseña = await bcrypt.hash(usuario.contraseña, 10);

  // Crea y guarda el nuevo usuario
console.log("Datos a crear:", usuario, hashedContraseña);
  const crearUsuario = await db.usuario.create({
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    contraseña: hashedContraseña, // Almacenamos la clave hasheada
 RolId: usuario.RolId,
  });

  console.log("nuevo Usuario:", crearUsuario);

  return { usuario: crearUsuario };
}

module.exports = {
  
  generateAccessToken,
  registerUser,
  verifyUser
};
