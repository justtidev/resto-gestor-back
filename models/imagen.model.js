
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Imagen = sequelize.define("Imagen", {

        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        ubicacion: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
       


    },
{
  tableName: 'imagens', // aquí pones el nombre exacto de la tabla
   freezeTableName: true,
  timestamps: true,
});

    return Imagen;
}

