require("dotenv").config(); // Dependencia que Carga las variables de entorno desde .env
const express = require("express");
const cors = require("cors"); // npm i cors
const app = express();

// CREAR SERVIDOR HTTP MANUALMENTE (para usarlo con socket.io)
const http = require("http");
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL;
// CONFIGURAR SOCKET.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // habilitá el origen que necesites en producción
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

//MiddleWare para cors
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

const PORT = process.env.PORT || 3000;

/*  Middleware(algo que se mete en el medio, una funcion que podemos meter en el medio) para parsear JSON en el cuerpo de las peticiones. Una funcion que permita procesar info tipo Json  */
app.use(express.json());

/* Middleware para parsear datos de formularios URL-encoded.Procesar q todas las url lleguen correctas sin caracteres raros*/
app.use(express.urlencoded({ extended: true }));

//Base de datos
const db = require("./models");

// para sincronizar cambios en la DB, usar:
//db.sequelize.sync({alter:true})

db.sequelize
  .sync()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => {
    console.log("Error al conectar la base de datos", error);
  });

//Rutas
require("./routes/index.routes")(app);

// SOCKET.IO CONNECTION
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado vía WebSocket");

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// HACER DISPONIBLE io PARA OTROS ARCHIVOS
app.set("io", io); // guardamos io en la app para usarlo en controladores

// incia el servidor (queda escuchando peticiones)
server.listen(PORT, "0.0.0.0", () => {
  console.log("El servidor esta corriendo en el puerto ", PORT);
  if (!process.env.GOOGLE_API_KEY) {
    console.warn(
      "ADVERTENCIA: La variable de entorno GOOGLE_API_KEY no está configurada. La API de Google AI no funcionará."
    );
  }
});
