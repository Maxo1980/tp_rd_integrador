import express from "express";
import AuthController from "../../controllers/authController.js";

import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";

const router = express.Router();
const authController = new AuthController();

// Ruta para inicio de sesión
router.post(
  "/login",
  [
    check("correoElectronico", "El correo electrónico es requerido!")
      .not()
      .isEmpty(),
    check(
      "correoElectronico",
      "Revisar el formato del correo electrónico!"
    ).isEmail(),
    check("contrasenia", "La contraseña es requerida!").not().isEmpty(),
    validarCampos,
  ],
  authController.login
);

// Ruta para registro de usuarios
router.post(
  "/register", // REGISTRO DE USUARIOS PARA EL CLIENTE
  [
    check("nombre", "El nombre es obligatorio!").not().isEmpty(),
    check("correoElectronico", "El correo electrónico es requerido!")
      .not()
      .isEmpty(),
    check(
      "correoElectronico",
      "Revisar el formato del correo electrónico!"
    ).isEmail(),
    check("contrasenia", "La contraseña es obligatoria!").not().isEmpty(),
    check(
      "contrasenia",
      "La contraseña debe tener al menos 6 caracteres!"
    ).isLength({ min: 6 }),
    validarCampos,
  ],
  authController.register
);

export { router };
