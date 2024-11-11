import conexion from "./conexion.js";

export default class Usuarios {
  buscarTodos = async () => {
    const sql = "SELECT * FROM usuarios;";
    const [result] = await conexion.query(sql);
    return result;
  };

  buscarActivos = async () => {
    const sql = "SELECT * FROM usuarios WHERE activo = 1;";
    const [result] = await conexion.query(sql);
    return result;
  };

  buscarInactivos = async () => {
    const sql = "SELECT * FROM usuarios WHERE activo = 0;";
    const [result] = await conexion.query(sql);
    return result;
  };

  buscarPorId = async (idUsuario) => {
    const sql = `SELECT * FROM usuarios WHERE activo = 1 AND idUsuario = ?`;
    const [result] = await conexion.query(sql, [idUsuario]);
    return result.length > 0 ? result[0] : null;
  };

  borrarPorId = async (idUsuario) => {
    const sql = `UPDATE usuarios SET activo = 0 WHERE idUsuario = ?`;
    try {
      const [result] = await conexion.query(sql, [idUsuario]);
      if (result.affectedRows > 0) {
        return { mesanje: "Usuario desactido con exito" };
      } else {
        return { mensaje: "Usuario no encontrado o ya desactivado" };
      }
    } catch (error) {
      console.error("Error al borrar usuario:", error);
      throw error;
    }
  };

  crearUsuario = async (nuevoUsuario) => {
    const sql = `INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo )
                     VALUES (?, ?, ?, ?, ?, NULL, 1)`;

    try {
      const {
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
      } = nuevoUsuario;
      const [result] = await conexion.query(sql, [
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
      ]);

      return {
        idUsuario: result.insertId,
        mensaje: "Usuario creado correctamente",
      };
    } catch (error) {
      console.error("Error al intentar crear el usuario:", error);
      throw error;
    }
  };
  actualizarUsuario = async (idUsuario, datosActualizados) => {
    const sql = `UPDATE usuarios SET 
        nombre = COALESCE(?, nombre),
        apellido = COALESCE(?, apellido),
        correoElectronico = COALESCE(?, correoElectronico),
        contrasenia = COALESCE(?, contrasenia),
        idTipoUsuario = COALESCE(?, idTipoUsuario) 
        WHERE idUsuario = ? AND activo = 1`;
    try {
      const [result] = await conexion.query(sql, [
        datosActualizados.nombre,
        datosActualizados.apellido,
        datosActualizados.correoElectronico,
        datosActualizados.contrasenia,
        datosActualizados.idTipoUsuario,
        idUsuario,
      ]);
      if (result.affectedRows === 0) {
        throw new Error("Usuario no encontrado o no se puede actualizar");
      }
      return { mensaje: "Usuario actualizado correctamente" };
    } catch (error) {
      console.error("Error al intentar actualizar el usuario:", error);
      throw new Error("Error al actualizar el usuario");
    }
  };
}
