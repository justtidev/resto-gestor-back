const { where } = require("sequelize");
const db = require("../models/index");
const comandaItem = db.comandaItem;
const comanda = db.comanda;

// Función utilitaria para recalcular el total de una comanda
//No la usamos pero NO la eliminamos, solo la dejamos disponible por si se llama manualmente. Por el momento se recalcula el total de la comanda en comandaController al crear, actualizar o eliminar un item de la comanda.
const recalcularTotalComanda = async (comandaId) => {
  const items = await comandaItem.findAll({ where: { ComandaId: comandaId } });

  const nuevoTotal = items.reduce((acc, item) => {
      return acc + parseFloat(item.precio_subtotal || 0);
  }, 0);

  await comanda.update({ precio_total: nuevoTotal }, { where: { id: comandaId } });
};

exports.obtenerTodos = (req, res) => {
  // const rgs = await usuario.findAll();

  comandaItem
    .findAll({
      include: [
        {
          model: db.menuItem,
         
        },
        { model: db.comanda ,
        
        }
      ]
    })
    .then((registros) => {
   
      res.status(200).json({
        ok: true,
        msg: "Listado de categorias",
        status: 200,
        data: registros,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener las categorias",
        status: 500,
        data: error,
      });
    });
};

exports.obtenerUno = (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;

  comandaItem.findOne({
    include: [
        {
          model: db.menuItem,
         },
        { model: db.comanda ,
        }
      ],
    where: { id: _id },
  })
    .then((registro) => {
      if (registro) {
        res.status(200).json({
          ok: true,
          msg: "ComandaItem encontrada",
          status: 200,
          data: registro,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "ComandaItem no encontrada",
          status: 404,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener la comandaItem",
        status: 500,
        data: error,
      });
    });
};

exports.crear = (req, res) => {
  const { cantidad, precio_subtotal, observaciones, ComandaId, MenuItemId } = req.body;
 console.log("LLEGA SUBTOTAL =", precio_subtotal)
  comandaItem.create({
    MenuItemId: MenuItemId,
    cantidad: cantidad,
    precio_subtotal: precio_subtotal,
    observaciones:observaciones,
   ComandaId:ComandaId,

  })
    .then(async (registro) => {
    
      res.status(201).json({
        ok: true,
        msg: "ComandaItem creada",
        status: 201,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al crear la comandaItem",
        status: 500,
        data: error,
      });
    });
};

exports.actualizar = (req, res) => {
  const _id = req.params.id;
  const { cantidad, precio_subtotal, observaciones } = req.body;
  comandaItem
    .update(
      {
        
        cantidad: cantidad,
    precio_subtotal: precio_subtotal,
    observaciones:observaciones,

      },
      {
        where: { id: _id },
      }
    )
    .then(async(resultado) => {
     
      res.status(200).json({
        ok: true,
        msg: "ComandaItem actualizada",
        status: 200,
        data: resultado,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al actualizar la comandaItem",
        status: 500,
        data: error,
      });
    });
};

exports.eliminar = async (req, res) => {
  const _id = req.params.id;
 
  // Obtener primero el item antes de eliminarlo
  const item = await comandaItem.findByPk(_id);
  if (!item) {
    return res.status(404).json({
      ok: false,
      msg: "ComandaItem no encontrada",
      status: 404,
    });
  }
  comandaItem
    .destroy({
      where: { id: _id },
    })
    .then(async (registro) => {
      
       res.status(200).json({
        ok: true,
        msg: "ComandaItem eliminada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar la comandaItem",
        status: 500,
        data: error,
      });
    });
};


