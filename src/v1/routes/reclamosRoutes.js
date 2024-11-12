import express from "express";

import ReclamosController from "../../controllers/reclamosController.js";

const router = express.Router();

const reclamosController = new ReclamosController();

// ruta para la paginacion para que de todos los reclamos
router.get("/", reclamosController.buscarTodos);

// aca crea el reclamo nuevo
router.post("/", reclamosController.crear);
export { router };
