import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Usuarios from "../database/usuarios.js";

dotenv.config();

const router = express.Router();

export default class UsuariosService {
  constructor() {
    this.usuarios = new Usuarios();
  }

  // busco todos los usuarios
  buscarTodos = () => {
    return this.usuarios.buscarTodos();
  };

  // busco usuarios activos
  buscarActivos = () => {
    return this.usuarios.buscarActivos();
  };

  // busco usuario por id
  buscarPorId = (idUsuario) => {
    return this.usuarios.buscarPorId(idUsuario);
  };

  // borro el usuaio
  borrarUsuario = (idUsuario) => {
    return this.usuarios.borrarPorId(idUsuario);
  };

  // creo usuario
  crearUsuario = (nuevoUsuario) => {
    return this.usuarios.crearUsuario(nuevoUsuario);
  };

  // actuliza usuario por id
  actualizarUsuario = (idUsuario, datosActualizados) => {
    return this.usuarios.actualizarUsuario(idUsuario, datosActualizados);
  };

  verificarToken = (req, res, next) => {
    const token = req.header("x-access-token");

    if (!token) {
      return res.status(403).json({ mensaje: "Token no proporcionado" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ mensaje: "Token no válido" });
    }
  };

  rutaProtegida = router.get("/protegida", this.verificarToken, (req, res) => {
    res.json({
      mensaje: "Acceso autorizado a la ruta protegida",
      userId: req.userId,
    });
  });
}
