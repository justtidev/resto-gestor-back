const { where } = require("sequelize");
const db = require("../models/index");
const rol = db.rol;

exports.obtenerTodos = (req, res) => {
  // const rgs = await usuario.findAll();

  rol
    .findAll()
    .then((registros) => {
      // res.send(registros);

      res.status(200).json({
        ok: true,
        msg: "Listado de roles",
        status: 200,
        data: registros,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener los roles",
        status: 500,
        data: error,
      });
    });
};

exports.obtenerUno = (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;

  rol.findOne({
    where: { id: _id },
  })
    .then((registro) => {
      if (registro) {
        res.status(200).json({
          ok: true,
          msg: "rol encontrado",
          status: 200,
          data: registro,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "rol no encontrado",
          status: 404,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener el rol",
        status: 500,
        data: error,
      });
    });
};

exports.crear = (req, res) => {
  const { nombre } = req.body;

  rol.create({
    nombre: nombre,

  })
    .then((registro) => {
      res.status(201).json({
        ok: true,
        msg: "rol creada",
        status: 201,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al crear la rol",
        status: 500,
        data: error,
      });
    });
};

exports.actualizar = (req, res) => {
  const _id = req.params.id;
  const { nombre } = req.body;
  rol
    .update(
      {
        nombre: nombre,

      },
      {
        where: { id: _id },
      }
    )
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "rol actualizada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al actualizar la rol",
        status: 500,
        data: error,
      });
    });
};

exports.eliminar = (req, res) => {
  const _id = req.params.id;

  rol
    .destroy({
      where: { id: _id },
    })
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "rol eliminada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar la rol",
        status: 500,
        data: error,
      });
    });
};

/* exports.ofertas = (req, res) => {
    res.send('Hola soy el root de usuario');
} */
