import jwt from "jsonwebtoken";
import passport from "passport";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { conexion } from "../database/conexion.js"; // Asegúrate de que este archivo esté configurado correctamente

dotenv.config();

export default class AuthController {
  // inicio de sesión
  login = async (req, res) => {
    passport.authenticate("local", { session: false }, (err, usuario, info) => {
      if (err || !usuario) {
        return res.status(400).json({
          estado: "Falla",
          mensaje: "Solicitud incorrecta.",
          error: err,
          usuario: usuario,
        });
      }

      // Armar el token y enviarlo como respuesta al cliente
      req.login(usuario, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        // Token expira en 1 minuto
        const token = jwt.sign(usuario, process.env.JWT_SECRET, {
          expiresIn: "60m",
        });
        return res.status(200).send({ estado: "OK", token: token });
      });
    })(req, res);
  };

  // ****regitro los usuarios aca me aseguro que esten los nombres, correoElectronico u la contrasenia
  register = async (req, res) => {
    try {
      const { nombre, correoElectronico, contrasenia } = req.body;

      // Valido que todos los campos estén presentes
      if (!nombre || !correoElectronico || !contrasenia) {
        return res.status(400).json({
          estado: "Falla",
          mensaje: "Todos los campos son obligatorios.",
        });
      }

      // Verifico si el correo ya está registrado
      const [usuarioExistente] = await conexion.execute(
        "SELECT * FROM usuarios WHERE correoElectronico = ?",
        [correoElectronico]
      );

      if (usuarioExistente.length > 0) {
        return res.status(409).json({
          estado: "Falla",
          mensaje: "El correo ya está registrado.",
        });
      }

      // Encripto la contraseña usando bcrypt antes de que se guarde enla base de datos
      //
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasenia, salt);

      // Inserto el nuevo usuario en la base de datos en la tabla usuarios le pongo ideUruarioTipo 3 para cliente
      await conexion.execute(
        "INSERT INTO usuarios (nombre, correoElectronico, contrasenia, idUsuarioTipo) VALUES (?, ?, ?, ?)",
        [nombre, correoElectronico, hashedPassword, 3] // 3 para el tipo de usuario "Cliente"
      );

      // Respuesta de éxito me da un codigo de estado 201 si fue exitoso
      return res.status(201).json({
        estado: "OK",
        mensaje: "Usuario registrado exitosamente.",
      });
    } catch (error) {
      console.error("Error en el registro de usuarios:", error);
      return res.status(500).json({
        estado: "Falla",
        mensaje: "Error del servidor. Intenta nuevamente.",
      });
    }
  };
}
