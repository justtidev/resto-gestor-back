
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const MenuItem = sequelize.define("MenuItem", {

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descripcionBreve: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        precio_item: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0,
        },
        
       
        disponible:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        },
    
    
    });

    return MenuItem;
}

