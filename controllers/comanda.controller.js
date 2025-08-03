const { where } = require("sequelize");
const { Op } = require("sequelize");
const db = require("../models/index");
const comanda = db.comanda;
const comandaItem = db.comandaItem;

exports.obtenerTodos = (req, res) => {
  // const rgs = await usuario.findAll();

  comanda
    .findAll({
      include: {
      model: db.comandaItem
    }})
    .then((registros) => {
      // res.send(registros);

      res.status(200).json({
        ok: true,
        msg: "Listado de comandas",
        status: 200,
        data: registros,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener las comandas",
        status: 500,
        data: error,
      });
    });
};

exports.obtenerUno = async (req, res) => {
  const _id = req.params.id;

  try {
    const resultado = await comanda.findOne({
      where: { id: _id },
      include: [
        {
          model: db.comandaItem,
          include: [db.menuItem],
        },
        {
          model: db.mesa,
        },
        {
          model: db.usuario,
        },
      ],
    });

    if (!resultado) {
      return res.status(404).json({
        ok: false,
        msg: "Comanda no encontrada",
        data: null,
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Comanda encontrada",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al obtener comanda:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la comanda",
      error,
    });
  }
};


exports.crear = async (req, res) => {
  const { UsuarioId, MesaId, productos, creadaPorIA = false } = req.body;

  // Validación mínima
  if (!UsuarioId || !MesaId) {
    return res.status(400).json({
      ok: false,
      msg: "Faltan datos requeridos: UsuarioId o MesaId",
      status: 400,
    });
  }

  try {
    // 1. Crear la comanda
    const nuevaComanda = await comanda.create({
      MesaId,
      UsuarioId,
      estado_Comanda: "Confirmada"
    });

    let precioTotal = 0;

    // 2. Insertar los productos en comandaItem
    for (const prod of productos) {
      const subtotal = prod.precio_subtotal ?? (prod.cantidad * prod.precio_unitario || 0);
      precioTotal += subtotal;

      await db.comandaItem.create({
        ComandaId: nuevaComanda.id,
        MenuItemId: prod.id,
        cantidad: prod.cantidad,
        observaciones: prod.observaciones,
        precio_subtotal: subtotal
      });
    }

    // 3. Actualizar el total de la comanda
    await nuevaComanda.update({ precio_total: precioTotal });

    // 4. Emitir evento por WebSocket
    const io = req.app.get("io");
    io.emit("actualizarComandas");

    // 5. Agregar valor dinámico para el frontend
    nuevaComanda.setDataValue("creadaPorIA", creadaPorIA);

    // 6. Responder
    res.status(201).json({
      ok: true,
      msg: "Comanda creada con productos",
      data: nuevaComanda,
    });

  } catch (error) {
    console.error("❌ Error al crear comanda:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al crear comanda",
      error: error.message,
      status: 500,
    });
  }
};


     


exports.actualizar = async (req, res) => {
  const id = req.params.id;
  const { estado_Comanda, fecha_cierre, MesaId, metodo_pago, productos } = req.body;

  try {
    const comandaExistente = await comanda.findByPk(id);
    if (!comandaExistente) {
      return res.status(404).json({
        ok: false,
        msg: "Comanda no encontrada",
      });
    }

    // Actualizamos los campos básicos si existen
    const campos = {};
    if (estado_Comanda) campos.estado_Comanda = estado_Comanda;
    if (fecha_cierre) campos.fecha_cierre = fecha_cierre;
    if (MesaId) campos.MesaId = MesaId;
    if (metodo_pago) campos.metodo_pago = metodo_pago;

    await comandaExistente.update(campos);

    // Si se enviaron productos, los reemplazamos completamente
    let precioTotal = 0;
    if (Array.isArray(productos)) {
      // 1. Borramos los items actuales
      await db.comandaItem.destroy({ where: { ComandaId: id } });

      // 2. Insertamos los nuevos
      for (const prod of productos) {
        const subtotal = prod.precio_subtotal ?? (prod.cantidad * prod.precio_unitario || 0);
        precioTotal += subtotal;

        await db.comandaItem.create({
          ComandaId: id,
          MenuItemId: prod.id,
          cantidad: prod.cantidad,
          observaciones: prod.observaciones,
          precio_subtotal: subtotal,
        });
      }

      // 3. Actualizamos el total
      await comandaExistente.update({ precio_total: precioTotal });
    }
    
    const io = req.app.get("io");
    io.emit("actualizarComandas");

    res.status(200).json({
      ok: true,
      msg: "Comanda actualizada",
      data: comandaExistente,
    });
  } catch (error) {
    console.error("Error al actualizar comanda:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la comanda",
      error,
    });
  }
};


// controllers/comandaController.js
exports.asignarMozo = async (req, res) => {
  const { id } = req.params; // ID de la comanda
  const { nombre } = req.body; // nombre del mozo que la toma

  if (!nombre) {
    return res.status(400).json({
      ok: false,
      msg: "Falta el nombre del mozo",
    });
  }

  try {
    const comanda = await db.comanda.findByPk(id);

    if (!comanda) {
      return res.status(404).json({
        ok: false,
        msg: "Comanda no encontrada",
      });
    }
// Buscar el mozo por nombre
    const mozo = await db.usuario.findOne({ where: { nombre } });

    if (!mozo) {
      return res.status(404).json({
        ok: false,
        msg: "Mozo no encontrado",
      });
    }

    // Asignar UsuarioId
    await comanda.update({ UsuarioId: mozo.id });


    // Emitir actualización solo una vez
    const io = req.app.get("io");
    io.emit("actualizarComandas");

    res.json({
      ok: true,
      msg: "Comanda actualizada con nuevo mozo",
      comanda,
    });
  } catch (error) {
    console.error("❌ Error al asignar mozo:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al asignar mozo a la comanda",
      error: error.message,
    });
  }
};
    


// GET /comanda/activas
exports.obtenerActivas = (req, res) => {
  db.comanda.findAll({
    where: { estado_Comanda:{
      [Op.in]: ["Confirmada", "Cerrada", "Pagada"] }},
    include: [
      { model: db.mesa },
      {
        model: db.comandaItem,
        include: [
          {
            model: db.menuItem
      }],
      },
      {model: db.usuario } // Asegúrate de que el alias sea correcto
    ],
  })
    .then((comandas) => {
      res.status(200).json({ ok: true, data: comandas });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
};

exports.obtenerComandaConfirmadaPorMesa = async (req, res) => {
  const mesaId = req.params.mesaId;

  try {

  const comanda = await db.comanda.findOne({
    where: { MesaId: mesaId, estado_Comanda: "Confirmada" },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: db.comandaItem,
        include: [db.menuItem],
      },
      { model: db.mesa },
      { model: db.usuario }
    ],
  });

  if (!comanda) {return res.json({ estado: "Libre" });}
else { return res.status(200).json({
  ok: true,
  msg: "Comanda confirmada encontrada",
  data: comanda,
});}
}catch (error) {
    console.error("Error al buscar comanda por mesa:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al buscar comanda por mesa.",
      error,
    });
}
}

exports.obtenerComandaPorMesa = async (req, res) => {
  const mesaId = req.params.mesaId;

  try {
    const comanda = await db.comanda.findOne({
      where: {
        MesaId: mesaId,
        estado_Comanda: {
          [db.Sequelize.Op.notIn]: ["Cancelada", "Liberada"],
        },
      },
      include: [
        {
          model: db.comandaItem,
          include: [db.menuItem],
        },
      ],
    });

    if (!comanda) {
      return res.status(404).json({
        ok: false,
        msg: "No hay comanda activa para esta mesa.",
      });
    }

    res.status(200).json({
      ok: true,
      data: comanda,
    });
  } catch (error) {
    console.error("Error al buscar comanda por mesa:", error);
    res.status(500).json({
      ok: false,
      msg: "Error interno al buscar comanda por mesa.",
      error,
    });
  }
};




exports.eliminar = (req, res) => {
  const _id = req.params.id;

  comanda
    .destroy({
      where: { id: _id },
    })
    .then((registro) => {
      const io = req.app.get("io");
io.emit("actualizarComandas");

      res.status(200).json({
        ok: true,
        msg: "Comanda eliminada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar la comanda",
        status: 500,
        data: error,
      });
    });
};

