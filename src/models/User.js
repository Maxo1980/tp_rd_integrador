import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.SERV,
  user: process.env.USUARIO,
  password: process.env.PASS,
  database: process.env.DBNAME,
});
// busco el usuraio por correoElectronico
export class User {
  static async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correoElectronico = ?",
      [email]
    );
    return rows[0];
  }

  //busco usuario por id
  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE idUsuariio= ?",
      [id]
    );
    return rows[0];
  }
  //creo un usuario nuevo
  static async create(user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const [result] = await pool.query(
      "INSERT INTO usuarios (correoElectronico, contrasenia, idTipoUsuario) VALUES (?, ?, ?)",
      [user.email, hashedPassword, user.perfil]
    );
    return result.insertId;
  }
  //y aca voy a comparar contraseeñas
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
