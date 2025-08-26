
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Mesa = sequelize.define("Mesa", {

   numero: { // Número o nombre de la mesa
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  
   /*  capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    }, */
    estado: {
      type: DataTypes.ENUM('Libre', 'Ocupada'), 
      allowNull: false,
      defaultValue: 'Libre',
    },
    qrUrl: {
  type: DataTypes.STRING,
  allowNull: true,
},
qrBase64: {
  type: DataTypes.TEXT,
  allowNull: true,
},

    
    
    },
      {
  tableName: 'mesas', // aquí pones el nombre exacto de la tabla
  freezeTableName: true,
  timestamps: true,
});

    return Mesa;
}

