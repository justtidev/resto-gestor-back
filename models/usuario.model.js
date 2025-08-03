
module.exports = (sequelize, Sequelize) => {

    //extraer tipo de datos de Sequelize
    const { DataTypes } = Sequelize;

    const Usuario = sequelize.define("Usuario", {
  usuario: {
            //Definicion de los campo
            type: DataTypes.STRING(100),
            allowNull: false,
        },
          email: {
            //Definicion de los campo
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        nombre: {
            //Definicion de los campo
            type: DataTypes.STRING(100),
            allowNull: false,
        },
          apellido: {
            //Definicion de los campo
            type: DataTypes.STRING(100),
            allowNull: false,
        },
      
        contraseña: {
            type: DataTypes.STRING(200),
            allowNull: false,


        },
        

    });

    return Usuario;
}

