const { where } = require("sequelize");
const db = require("../models/index");
const mesa = db.mesa;
const QRCode = require("qrcode");
const QR_BASE_URL = process.env.QR_BASE_URL || "http://192.168.0.108:5173/mesa";


exports.obtenerTodos = async (req, res) => {
  // const rgs = await usuario.findAll();
try{
  const registros = await mesa.findAll();
  const estadosDisponibles = mesa.rawAttributes.estado.values;
  
  // Agregar QR a cada mesa
    const mesasConQR = await Promise.all(
      registros.map(async (m) => {
        const url = `${QR_BASE_URL}?mesa=${m.id}`;
        const qrBase64 = await QRCode.toDataURL(url);
        return {
          ...m.toJSON(),
          qrBase64,
          qrUrl: url,
        };
      })
    );
  
      // res.send(registros);
 
      res.status(200).json({
        ok: true,
        msg: "Listado de categorias",
        status: 200,
        data:  mesasConQR,
      estadosDisponibles,
      });
    }catch(error) {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener las mesas",
        status: 500,
        data: error,
      });
    };
};

exports.obtenerUno = async (req, res) => {
  // obtener el parametro id
  const _id = req.params.id;

 try{
  const registro= await mesa.findOne({
    where: { id: _id },
  });
    
      if (registro) {
         const estadosDisponibles = mesa.rawAttributes.estado.values;
        res.status(200).json({
          ok: true,
          msg: "Mesa encontrada",
          status: 200,
          data: registro, estadosDisponibles,
        });
      } else {
        res.status(404).json({
          ok: false,
          msg: "Mesa no encontrada",
          status: 404,
          data: null,
        });
      }
    } catch(error) {
      res.status(500).json({
        ok: false,
        msg: "Error al obtener la mesa",
        status: 500,
        data: error,
      });
    };
};

exports.crear = async (req, res) => {
  const { numero } = req.body;

 try {
  const nuevaMesa= await mesa.create({
    numero: numero,
    //el estado es por Default "Libre"
    });
    const qrBase64 = await QRCode.toDataURL(url);

//Socket.IO: Emitir evento para actualizar mesas
      const io = req.app.get("io");
io.emit("actualizarMesas");

      res.status(201).json({
        ok: true,
        msg: "Mesa creada",
        status: 201,
        data: {...nuevaMesa.toJSON(),
          qrBase64,
          qrUrl:url,
        },
      });
    } catch(error) {
      res.status(500).json({
        ok: false,
        msg: "Error al crear la mesa",
        status: 500,
        data: error,
      });
    };
};

exports.actualizar = (req, res) => {
  const _id = req.params.id;
  const { numero, estado } = req.body;
  mesa
    .update(
      {
        numero: numero,
        estado:estado,

      },
      {
        where: { id: _id },
      }
    )
    .then((registro) => {
      const io = req.app.get("io");
io.emit("actualizarMesas");

      res.status(200).json({
        ok: true,
        msg: "Mesa actualizada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al actualizar la mesa",
        status: 500,
        data: error,
      });
    });
};

exports.eliminar = (req, res) => {
  const _id = req.params.id;

  mesa
    .destroy({
      where: { id: _id },
    })
    .then((registro) => {
      const io = req.app.get("io");
io.emit("actualizarMesas");

      res.status(200).json({
        ok: true,
        msg: "Mesa eliminada",
        status: 200,
        data: registro,
      });
    })
    .catch((error) => {
      res.status(500).json({
        ok: false,
        msg: "Error al eliminar la mesa",
        status: 500,
        data: error,
      });
    });
};


