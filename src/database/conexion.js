import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mi_base_de_datos",
  port: process.env.DB_PORT || 3306,
});

export default pool;

console.log(".oO( Conexión a la DB exitosa! )Oo.\n");
