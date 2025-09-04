
module.exports = (sequelize, Sequelize) => {

    const { DataTypes } = Sequelize;
    const Alergeno = sequelize.define("Alergeno", {


        nombre: {
            type: DataTypes.STRING(),
            allowNull: true,
        },

    },
{
  tableName: 'alergenos', // aquí pones el nombre exacto de la tabla
   freezeTableName: true,
  timestamps: true,
});

    return Alergeno;
}

