
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Rol = sequelize.define("Rol", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    });

    return Rol;
}

