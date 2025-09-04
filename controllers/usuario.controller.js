const db = require("../models/index");
const bcrypt = require('bcrypt');

async function crearUsuario(req, res) {
    const usuario = req.body;

    try {
        const crearUsuario = await db.usuario.create(
            {
                usuario: usuario.usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                
                contraseña: usuario.contraseña,
                email: usuario.email,
                RolId: usuario.RolId,
                
            });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Usuario Creado",
            mensaje: crearUsuario,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message,
        });
    }
}

async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await db.usuario.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            data: usuarios,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message,
        });
    }
}

async function obtenerUsuarioById(req, res) {
    const id = req.params.id;

    try {
        const usuario = await db.usuario.findOne({
            where: { id: id },
            
             include: [{
                model: db.rol,    
        }]});

        res.status(200).json({
            ok: true,
            status: 200,
            data: usuario,
            message: `Acceso concedido al usuario con ID: ${id}`,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message,
        });
    }
}

async function actualizarUsuario(req, res) {
    const id = req.params.id;
    const usuario = req.body;

    try {
      let hash = undefined;
        if (usuario.contraseña) {
            hash = await bcrypt.hash(usuario.contraseña, 10);
        }
        console.log("actualiza hash", hash)
        const actualizaUsuario = await db.usuario.update(
            {
                usuario: usuario.usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                
                email: usuario.email,
                RolId: usuario.RolId,
                ...(hash && { contraseña: hash })
            },
            {
                where: { id: id },
            }
        );

        res.status(200).json({
            ok: true,
            status: 200,
            body: actualizaUsuario,
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message,
        });
    }
}

async function eliminarUsuario(req, res) {
    const id = req.params.id;

    try {
        const eliminaUsuario = await db.usuario.destroy({
            where: { id: id },
        });

        res.status(204).json({
            ok: true,
            status: 204,
            data: eliminaUsuario,
            message: "Usuario eliminado correctamente",
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            status: 500,
            message: error.message,
        });
    }
}


async function loginUsuario(req, res) {
    const { usuario, contraseña } = req.body;

    try {
        const user = await db.usuario.findOne({ where: { usuario } });

        // Verificar si el usuario existe y si la clave coincide
        if (!user || user.contraseña !== contraseña) {
            return res.status(401).json({
                ok: false,
                message: "Credenciales incorrectas"
            });
        }

        // Si las credenciales son correctas
        res.status(200).json({
            ok: true,
            message: "Inicio de sesión exitoso",
            usuario: {
                id: user.id,
                usuario: user.usuario,
               
                RolId: user.RolId
            }
        });

    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
}


module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioById,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
};

//vER SI crearUsuario y loginUsuario lo ELIMINO  Y reemplazo con registeR y login del auth.controller.js


/* const { where } = require("sequelize");
const db = require("../models/index");
const usuario = db.usuario;

exports.obtenerTodos = (req, res) => {
  // const rgs = await usuario.findAll();

  usuario
    .findAll()
    .then((registros) => {
      // res.send(registros);

      res.status(200).json({
        ok: true,
        msg: "Listado de usuarios",
        status: 200,
        data: registros,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener los usuarios",
        status: 500,
        data: error,
      });
    });
};

exports.obtenerUno = (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;

  usuario
    .findOne({
      where: { id: _id },
    })
    .then((registro) => {
      if (registro) {
        res.status(200).json({
          ok: true,
          msg: "usuario encontrado",
          status: 200,
          data: registro,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "usuario no encontrado",
          status: 404,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener el usuario",
        status: 500,
        data: error,
      });
    });
};

exports.crear = (req, res) => {
  const { nombre, apellido, email, contraseña, rol } = req.body;

  usuario
    .create({
      nombre: nombre,
      apellido: apellido,
      email: email,
      contraseña: contraseña,
      rol: rol
    })
    .then((registro) => {
      res.status(201).json({
        ok: true,
        msg: "usuario creado",
        status: 201,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al crear el usuario",
        status: 500,
        data: error,
      });
    });
};

exports.actualizar = (req, res) => {
  const _id = req.params.id;
  const { nombre, apellido, email, contraseña, rol } = req.body;
  usuario
    .update(
      {
        nombre: nombre,
        apellido: apellido,
        email: email,
        contraseña: contraseña,
        rol: rol
      },
      {
        where: { id: _id },
      }
    )
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "usuario actualizado",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al actualizar el usuario",
        status: 500,
        data: error,
      });
    });
};

exports.eliminar = (req, res) => {
  const _id = req.params.id;

  usuario
    .destroy({
      where: { id: _id },
    })
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "usuario eliminado",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar el usuario",
        status: 500,
        data: error,
      });
    });
}; */


