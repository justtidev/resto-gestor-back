
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
       


    });

    return Imagen;
}

