const { Op } = require('sequelize');
const { comanda, mesa, cierreCaja, usuario } = require('../models');

// Obtener comandas pagadas para cierre de caja
async function obtenerComandasParaCierre(req, res) {
  try {
    const { fecha, page = 1, pageSize = 10, sortBy = 'fecha_apertura', sortOrder = 'desc' } = req.query;

    if (!fecha) {
      return res.status(400).json({ message: 'El parámetro "fecha" es requerido.' });
    }

    const fechaInicio = new Date(`${fecha}T00:00:00.000Z`);
    const fechaFin = new Date(`${fecha}T23:59:59.999Z`);
    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const { rows: comandas, count: totalComandas } = await comanda.findAndCountAll({
      where: {
         estado_Comanda: 'Liberada',
  fecha_apertura: {
    [Op.between]: [fechaInicio, fechaFin],
  }
        
      },
       include: [
    {
      model: mesa,
      attributes: ['numero'],
    },
    {
      model: usuario,
      attributes: ['nombre'],
    },
  ],
      limit,
      offset,
      order,
      attributes: ['id', 'precio_total', 'estado_Comanda', 'metodo_pago', 'fecha_apertura', 'MesaId']
    });

    res.status(200).json({
      data: comandas,
      totalCount: totalComandas,
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages: Math.ceil(totalComandas / limit),
    });

  } catch (error) {
    console.error('❌ Error al obtener comandas para cierre:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// Registrar un nuevo cierre de caja
async function registrarCierre(req, res) {
  try {
    const {
      fecha,
      total_ventas,
      totales_por_pago,
      montos_fisicos,
      diferencias,
      usuarioId
    } = req.body;

    if (!fecha || total_ventas === undefined || !totales_por_pago || !usuarioId) {
      return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    const cierreExistente = await cierreCaja.findOne({ where: { fecha_cierre: fecha } });
    if (cierreExistente) {
      return res.status(409).json({ message: 'Ya existe un cierre para esta fecha.' });
    }

    const nuevoCierre = await cierreCaja.create({
      fecha_cierre: fecha,
      total_ventas,
      total_efectivo: totales_por_pago.Efectivo || 0,
      total_credito: totales_por_pago.Crédito || 0,
      total_debito: totales_por_pago.Débito || 0,
      total_mercadoPago: totales_por_pago.MercadoPago || 0,
      efectivo_fisico: montos_fisicos.efectivo || 0,
      credito_fisico: montos_fisicos.Crédito || 0,
      debito_fisico: montos_fisicos.Débito || 0,
      mercadoPago_fisico: montos_fisicos.MercadoPago || 0,
      diferencia_efectivo: diferencias?.efectivo || 0,
      diferencia_credito: diferencias?.Crédito || 0,
      diferencia_debito: diferencias?.Débito || 0,
      diferencia_mercadoPago: diferencias?.MercadoPago || 0,
      usuario_id: usuarioId
    });

    res.status(201).json({
      message: '✅ Cierre de caja registrado con éxito.',
      cierre: nuevoCierre
    });

  } catch (error) {
    console.error('❌ Error al registrar cierre:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

// controladorcierreCaja.js
async function obtenerHistoricoCierres(req, res) {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'fecha_cierre',
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;

    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;
    const order = [[sortBy, sortOrder.toUpperCase()]];
    const where = {};

    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);
      where.fecha_cierre = { [Op.between]: [start, end] };
    } else if (startDate) {
      where.fecha_cierre = { [Op.gte]: new Date(`${startDate}T00:00:00.000Z`) };
    } else if (endDate) {
      where.fecha_cierre = { [Op.lte]: new Date(`${endDate}T23:59:59.999Z`) };
    }

    const { rows: cierres, count: totalCierres } = await cierreCaja.findAndCountAll({
      where,
      limit,
      offset,
      order,
      include: {
        model: usuario,
        as: 'usuario', 
        attributes: ['nombre'],
      },
    });

    res.status(200).json({
      data: cierres,
      totalCount: totalCierres,
      page: parseInt(page, 10),
      pageSize: limit,
      totalPages: Math.ceil(totalCierres / limit),
    });
  } catch (error) {
    console.error('Error al obtener histórico de cierres:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}


// Eliminar un cierre de caja
async function eliminarCierre(req, res) {
  try {
    const { id } = req.params;

    const eliminado = await cierreCaja.destroy({ where: { id } });

    if (!eliminado) {
      return res.status(404).json({ message: 'Cierre no encontrado.' });
    }

    res.status(200).json({ message: '🗑️ Cierre eliminado con éxito.' });

  } catch (error) {
    console.error('❌ Error al eliminar cierre:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = {
  obtenerComandasParaCierre,
  registrarCierre,
  obtenerHistoricoCierres,
  eliminarCierre
};



