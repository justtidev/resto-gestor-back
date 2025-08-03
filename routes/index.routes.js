
module.exports = (app) => {

    const rutasMenuItem = require("./menuItem.routes");

    app.use("/menuItem", rutasMenuItem);

     const rutasComanda = require("./comanda.routes");

    app.use("/comanda", rutasComanda);

     const rutasComandaItem = require("./comandaItem.routes");

    app.use("/comandaItem", rutasComandaItem);
   
    const rutasUsuario = require("./usuario.routes");

    app.use("/usuario", rutasUsuario);

     const rutasMesa = require("./mesa.routes");

    app.use("/mesa", rutasMesa);

    const rutasCategoria = require("./categoria.routes");

    app.use("/categoria", rutasCategoria);

    
    const rutasImagen = require("./imagen.routes");

    app.use("/imagen", rutasImagen);

    const rutasRol = require("./rol.routes");

    app.use("/rol", rutasRol);

     const rutasCierreCaja = require("./cierre-caja.routes");

    app.use("/cierre-caja", rutasCierreCaja);



    // Rutas de autenticación
 const authRoutes = require('./auth.routes');
 
 app.use('/auth', authRoutes);

 // Usar las rutas de AI bajo el prefijo /api
const rutasAi = require("./ai.routes");
 app.use('/api', rutasAi);

 const qrRoutes = require("./qr.routes");
app.use("/api", qrRoutes);

 
 //app.use('/auth-clientes', authRoutes);
 
 // Rutas de administración
 /* const adminRoutes = require('./menuItem.routes');
 
 app.use('/menuItem', adminRoutes); */
   

};