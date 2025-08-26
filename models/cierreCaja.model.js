
module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const CierreCaja = sequelize.define("CierreCaja", {
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true, // Para que no se repita por día
    },
    total_ventas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_efectivo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_credito: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
      total_debito: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total_mercadoPago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios", // nombre de la tabla de usuarios (asegúrate que coincida)
        key: "id",
      },
    },
    montos_fisicos: {
  type: DataTypes.JSON,
  allowNull: true,
}
  }, 
{
  tableName: 'cierrecajas', // aquí pones el nombre exacto de la tabla
   freezeTableName: true,
  timestamps: true,
});

  return CierreCaja;
};

