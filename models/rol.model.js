
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Rol = sequelize.define("Rol", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    },
{
  tableName: 'rols' // aquí pones el nombre exacto de la tabla
});

    return Rol;
}

