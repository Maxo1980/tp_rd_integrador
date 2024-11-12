import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // variables de entorno

// Crear la conexión con la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
