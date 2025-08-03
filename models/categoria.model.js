
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Categoria = sequelize.define("Categoria", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    });

    return Categoria;
}

