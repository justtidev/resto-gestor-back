//objeto completo de sequelize,, por eso constante es con mayus
const Sequelize = require("sequelize");

//en config/index tengo la info para acceder a la base de datos("nombre del esquema", "user", "password", objJson))
const config = require("../config/index"); // se puede omitir el index.js

//el objeto sequelize con minuscula la s representa la conexion a la base de datos
//() vamos a ir cargando un monton de info que la conseguimos adentro del motor de BD
//()traigo de config.db las propiedades("nombre del esquema", "user", "password", objJson))
const sequelize = new Sequelize(
  config.db.schema,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    logging: false, // opcional, para no saturar logs
    retry: {
      max: 3 // reintenta 3 veces si falla la conexión
  },
   pool: {
      max: 10,      // máximo de conexiones simultáneas
      min: 0,
      acquire: 30000, // 30s para obtener una conexión
      idle: 10000     // 10s de inactividad
    }
  }
);

//genermos objeto db vacio para usarlo como un contenedor. Que agrupe todo lo necesario 
const db = {};

//creamos propiedad Sequelize y sequelize que vamos a necesitar
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importar los modelos
//"require" porque estoy haciendo una importacion del archivo que puede ser menuItem.model. Que esta en la misma carpeta de index.js
//despues del require + menuItem.model  ponemos un parametro sequelize

db.menuItem = require("./menuItem.model")(sequelize, Sequelize);
db.usuario = require("./usuario.model")(sequelize, Sequelize);
db.rol = require("./rol.model")(sequelize, Sequelize);
db.categoria = require("./categoria.model")(sequelize, Sequelize);
db.imagen = require("./imagen.model")(sequelize, Sequelize);
db.comandaItem = require("./comandaItem.model")(sequelize, Sequelize);
db.comanda = require("./comanda.model")(sequelize, Sequelize);
db.mesa = require("./mesa.model")(sequelize, Sequelize);
db.cierreCaja = require("./cierreCaja.model")(sequelize, Sequelize);


db.alergeno = require("./alergeno.model")(sequelize, Sequelize);

// relaciones entre modelos

//un menuItem tiene muchas imagenes
db.menuItem.hasMany(db.imagen);
//una imagen tiene un menuItem
db.imagen.belongsTo(db.menuItem);

//una categoria tiene muchos menuItem
db.categoria.hasMany(db.menuItem);
//un menuItem tiene una categoria, idCategoria esta en menuItem
db.menuItem.belongsTo(db.categoria);

// ítem de menú puede estar en muchas comandasItem
db.menuItem.hasMany(db.comandaItem);
// una comandaItem pertenece a un solo ítem del menú.
db.comandaItem.belongsTo(db.menuItem);

//un usuario pertenece a 1 rol
db.usuario.belongsTo(db.rol);
//un rol tiene muchos usuarios. idRol esta en usuarios
db.rol.hasMany(db.usuario)


//un usuario puede tener muchas comandas
db.usuario.hasMany(db.comanda,  );
//una comanda pertenece a 1 usuario/mozo
db.comanda.belongsTo(db.usuario, )

// Un comanda tiene muchss comandaItem
db.comanda.hasMany(db.comandaItem);
//una comandaItem tiene un comanda
db.comandaItem.belongsTo(db.comanda)



//una mesa tiene una comanda
db.mesa.hasOne(db.comanda);
//un comanda pertenece a 1 mesa, necesita el idMesa
db.comanda.belongsTo(db.mesa);

// Asociación muchos a muchos. un menuItem tiene muchos alergenos
db.menuItem.belongsToMany(db.alergeno, { through: 'menuItemAlergeno' } );
//un alergeno tiene muchos productos
db.alergeno.belongsToMany(db.menuItem,{ through: 'menuItemAlergeno' })

db.cierreCaja.belongsTo(db.usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario',

});


db.usuario.hasMany(db.cierreCaja, {
  foreignKey: 'usuario_id',
  as: 'cierres',
  
});





  









module.exports = db;
