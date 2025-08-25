
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Categoria = sequelize.define("Categoria", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    },
{
  tableName: 'categoria' // aquí pones el nombre exacto de la tabla
});

    return Categoria;
}

