
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const ComandaItem = sequelize.define("ComandaItem", {

 
     cantidad: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 1
      
    },
    precio_subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        observaciones:{
            type: DataTypes.TEXT(),
            allowNull: true,
        }
      
    
    
    },
);

    return ComandaItem;
}

