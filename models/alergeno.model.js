
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Alergeno = sequelize.define("Alergeno", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    });

    return Alergeno;
}

