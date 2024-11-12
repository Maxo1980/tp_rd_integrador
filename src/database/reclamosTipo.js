import db from "../config/database.js"; // Configuración de tu base de datos

class ReclamosTipoService {
  // Obtener reclamos con paginación
  async obtenerReclamosPaginados(offset, limit) {
    const query = `SELECT * FROM reclamos LIMIT ? OFFSET ?`;
    const [rows] = await db.execute(query, [limit, offset]); // Ejecuta la consulta con el límite y el offset
    return rows;
  }

  // Obtener el total de reclamos
  async obtenerTotalReclamos() {
    const query = `SELECT COUNT(*) AS total FROM reclamos`;
    const [rows] = await db.execute(query);
    return rows[0].total; // Devolvemos el total de reclamos
  }

  // Crear un nuevo reclamo
  async crearReclamo(nuevoReclamo) {
    const { descripcion, clienteId, estado } = nuevoReclamo;
    const query = `INSERT INTO reclamos (descripcion, clienteId, estado) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [descripcion, clienteId, estado]);
    return { id: result.insertId, ...nuevoReclamo };
  }
}

export default ReclamosTipoService;
