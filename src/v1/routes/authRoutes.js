import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Ruta de login
router.post("/login", async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;

  // Agregamos un log para verificar que la solicitud esté recibiendo los datos correctamente
  console.log("Solicitud recibida en /login con datos:", req.body);

  try {
    // Usamos correoElectronico para buscar al usuario en la base de datos
    const user = await User.findByEmail(correoElectronico);

    // Verificamos si el usuario fue encontrado
    if (!user) {
      console.log("Usuario no encontrado con el correo:", correoElectronico);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("Usuario encontrado:", user);

    // Verificamos si la contraseña es correcta
    const isPasswordValid = await User.comparePassword(
      contrasenia,
      user.contrasenia
    );
    if (!isPasswordValid) {
      console.log("Contraseña incorrecta para el usuario:", correoElectronico);
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Si la contraseña es correcta, generamos el token
    const token = jwt.sign(
      { userId: user.idUsuario, perfil: user.idTipoUsuario }, // Usamos los campos correctos de la base de datos
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generado correctamente:", token);

    // Enviamos el token y el perfil del usuario como respuesta
    res.json({ token, perfil: user.idTipoUsuario });
  } catch (error) {
    // Capturamos cualquier error inesperado y lo mostramos en la consola
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export { router as authRouter };
