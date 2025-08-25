
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Alergeno = sequelize.define("Alergeno", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    },
{
  tableName: 'alergeno' // aquí pones el nombre exacto de la tabla
});

    return Alergeno;
}

