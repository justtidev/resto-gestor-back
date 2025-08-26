
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Comanda = sequelize.define("Comanda", {
//Cuando se abre una Comanda esta "En proceso", al confirmar el Pedido esta "Confirmada"
    estado_Comanda: {
      type: DataTypes.ENUM('En proceso', 'Confirmada', 'Cerrada', 'Pagada', 'Cancelada', 'Liberada'),
      allowNull: false,
      defaultValue: 'En proceso',
    },
    metodo_pago: {
  type: DataTypes.ENUM('Efectivo', 'Débito', 'Crédito', 'MercadoPago'),
  allowNull: true,
},
   
    fecha_apertura: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: true
    },
   
      precio_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
          // Sequelize ejemplo
pagadaEn: {
  type: DataTypes.DATE,
  allowNull: true, // solo se setea cuando se paga
}

/*   comensales: {
      type: DataTypes.INTEGER(),
      allowNull: true,
      
    }, */
      
    
    
    },
      {
  tableName: 'comandas', // aquí pones el nombre exacto de la tabla
   freezeTableName: true,
  timestamps: true,
});

    return Comanda;
}

