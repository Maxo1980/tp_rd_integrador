import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import v1Usuarios from "./v1/routes/usuariosRoutes.js";

// Importo middlewares
import validateContentType from "./middlewares/validateContentType.js";
import { verifyToken, verifyRole } from "./v1/auth.js";

// Importo rutas
import { router as v1ReclamosEstadoRouter } from "./v1/routes/reclamosEstadosRoutes.js";
import { router as v1ReclamosRouter } from "./v1/routes/reclamosRoutes.js";
import { authRouter } from "./v1/routes/authRoutes.js";

dotenv.config();
const PORT = process.env.PUERTO;

const app = express();

app.use(express.json());
app.use(validateContentType);

app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await usuarios.buscarTodos();
    console.log("Usuarios encontrados:", resultado);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// verifico que el usuario sea empleado
app.use(
  "/v1/reclamos-estados",
  verifyToken,
  verifyRole(["empleado"]),
  v1ReclamosEstadoRouter
);
// verifica que el cliente sea o usuario o empleado
app.use(
  "/v1/reclamos",
  verifyToken,
  verifyRole(["cliente", "empleado"]),
  v1ReclamosRouter
);

app.use("/v1/usuarios", verifyToken, verifyRole(["admin"]), v1Usuarios);

// login
app.use("/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`*** Servidor escuchando en puerto: ${PORT} ***`);
});
