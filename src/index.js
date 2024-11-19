import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

//Login y validacion
import { estrategia, validacion } from "./config/passport.js";

// middlewares
import validateContentType from "./middlewares/validateContentType.js";

// rutas
import { router as v1ReclamosEstadoRouter } from "./v1/routes/reclamosEstadosRoutes.js";
import { router as v1ReclamosRouter } from "./v1/routes/reclamosRoutes.js";
import { router as v1RelclamosTipo } from "./v1/routes/reclamosTipoRoutes.js";
import { router as v1Usuarios } from "./v1/routes/usuariosRoutes.js";
import { router as v1UsuariosTipo } from "./v1/routes/usuariosTipoRoutes.js";
import { router as v1Oficinas } from "./v1/routes/oficinasRoutes.js";
import { router as v1UsuariosOficinas } from "./v1/routes/usuariosOficinasRoutes.js";
import { router as v1AuthRouter } from "./v1/routes/authRoutes.js";

dotenv.config(); //configura las variables de entorno
const PORT = process.env.PUERTO;

const app = express();

app.use(express.json());
app.use(validateContentType);
//configuracion de cors para
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//Login
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

//Morgan para logs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "accesos.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.json({ estado: true });
});

// configuración swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API REST - Programación 3 - 2024",
      version: "1.0.0",
      description:
        "API REST para la gestión de reclamos de la concesionaria de automóviles Prog.III GRUPO 6. ",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./v1/routes/*.js"],
};

// generar la especificación de swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

//
//Rutas de los EndPoints
app.use("/v1/reclamos-estados", v1ReclamosEstadoRouter);
app.use(
  "/v1/reclamos",
  passport.authenticate("jwt", { session: false }),
  v1ReclamosRouter
);
app.use("/v1/usuarios", v1Usuarios);
app.use("/v1/usuariosTipo", v1UsuariosTipo);
app.use("/v1/oficinas", v1Oficinas);
app.use("/v1/reclamosTipo", v1RelclamosTipo);
app.use("/v1/usuariosOficinas", v1UsuariosOficinas);

//REGISTRO DE USURIOS
app.use("/v1/auth", v1AuthRouter); // esta es la ruta de REGISTRO DE USUARIOS
// swagger-ui-express sirve la interfaz Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ***paginacion ***
// Configuración de la paginación (esto no modifica el flujo original, solo asegura que se use la paginación)
app.use("/v1/reclamos", (req, res, next) => {
  // Asegurarse de pasar la paginación a la consulta de los reclamos
  const { page = 1, limit = 10 } = req.query; // toma el valor de página y límite de los query params
  req.pagination = {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  };
  next();
});

//Config del servidor express
app.listen(PORT, () => {
  console.log(`*** Servidor escuchando en puerto: ${PORT} ***`);
});
