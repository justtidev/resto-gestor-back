const { where } = require("sequelize");
const db = require("../models/index");
const imagen = db.imagen;

exports.obtenerTodos = (req, res) => {
  // const rgs = await imagen.findAll();

  imagen
    .findAll({
       include: [
        {
          model: db.menuItem 
        }
      ] 
      
    })
    
    .then((registros) => {
      // res.send(registros);

      res.status(200).json({
        ok: true,
        msg: "Listado de imagenes",
        status: 200,
        data: registros,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener las imagenes",
        status: 500,
        data: error,
      });
    });
};

exports.obtenerUno = (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;

  imagen
    .findOne({
      include: [
        {
          model: db.menuItem 
        }
      ] ,
      
      where: { id: _id },

    },)
    .then((registro) => {
      if (registro) {
        res.status(200).json({
          ok: true,
          msg: "imagen encontrada",
          status: 200,
          data: registro,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "imagen no encontrada",
          status: 404,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener la imagen",
        status: 500,
        data: error,
      });
    });
};

exports.obtenerImagenPorProd = (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;
  imagen.findAll({
      where: { MenuItemId: _id },
    })
    .then((registro) => {
      if (registro) {
        res.status(200).json({
          ok: true,
          msg: "Imagen encontrada",
          status: 200,
          data: registro,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "Imagen no encontrada",
          status: 404,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener la imagen",
        status: 500,
        data: error,
      });
    });
};


exports.crear = (req, res) => {
  const { nombre, ubicacion, MenuItemId } = req.body;

  imagen
    .create({
      nombre:nombre,
      ubicacion: ubicacion,
      
      MenuItemId: MenuItemId,
    
      

    })
    .then((registro) => {
      res.status(201).json({
        ok: true,
        msg: "Imagen creada",
        status: 201,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al crear la imagen",
        status: 500,
        data: error,
      });
    });
};

exports.actualizar = (req, res) => {
  const _id = req.params.id;
  const { nombre, ubicacion, MenuItemId } = req.body;
  imagen
    .update(
      {
        nombre:nombre,
        ubicacion: ubicacion,
        
        MenuItemId: MenuItemId,
      

      },
      {
        where: { id: _id },
      }
    )
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "Imagen actualizada",
        status: 200,
        data: registro
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al actualizar la imagen",
        status: 500,
        data: error,
      });
    });
};

exports.eliminar = (req, res) => {
  const _id = req.params.id;

  imagen
    .destroy({
      where: { id: _id },
    })
    .then((registro) => {
      res.status(200).json({
        ok: true,
        msg: "Imagen eliminada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar la imagen",
        status: 500,
        data: error,
      });
    });
};

/* exports.ofertas = (req, res) => {
    res.send('Hola soy el root de imagen');
} */
