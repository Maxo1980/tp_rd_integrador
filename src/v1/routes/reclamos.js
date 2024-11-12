import express from "express";
import {
  actualizarEstadoReclamo,
  cancelarReclamo,
} from "../../controllers/ReclamosController.js";

const router = express.Router();

// Actualizo los reclamos
router.put("/:id/estado", actualizarEstadoReclamo);

// aca se ancelp los reclamos
router.put("/:id/cancelar", cancelarReclamo);

export default router;
