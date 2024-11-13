import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import { maxHeaderSize } from "http";

export default class NotificacionesService {
  enviarCorreo = async (datosCorreo) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const plantillaPath = path.join(
      __dirname,
      "../utils/handlebars/plantillaMail.hbs"
    );
    const plantilla = fs.readFileSync(plantillaPath, "utf-8");

    const template = handlebars.compile(plantilla);
    const datos = {
      nombre: datosCorreo.cliente,
      reclamo: datosCorreo.reclamo,
      estado: datosCorreo.estado,
    };
    const correoHtml = template(datos);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CORREO,
        pass: process.env.CLAVE,
      },
    });

    const mailOptions = {
      to: datosCorreo.correoElectronico,
      cc: "maxi.kildoff@gmail.com",
      subject: "NOTIFICACION CAMBIO DE ESTADO RECLAMO",
      html: correoHtml,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { estado: true, mensaje: "Correo electrónico enviado." };
    } catch (error) {
      return { estado: false, mensaje: "Correo electrónico no enviado." };
    }
  };
}