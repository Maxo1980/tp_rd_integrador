import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Obtengo el header de autorización
  const authHeader = req.headers["authorization"];

  // Verifico si el header no está presente
  if (!authHeader) {
    return res.status(403).json({ mensaje: "No se proporcionó un token." });
  }

  // El token debe estar en formato Bearer <token>, lo divido para obtener solo el token
  const token = authHeader.split(" ")[1];

  // Verifico si no hay token o el formato es incorrecto
  if (!token) {
    return res.status(403).json({ mensaje: "Formato de token inválido." });
  }

  try {
    // Verifico y decodifico el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almaceno el usuario decodificado en el request
    next(); // Continúo al siguiente middleware o ruta
  } catch (error) {
    // Si el token es inválido o ha expirado
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

// Middleware para verificar roles
export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const { perfil } = req.user;

    if (!rolesPermitidos.includes(perfil)) {
      return res.status(403).json({
        mensaje: "Acceso denegado. No tienes permiso para esta acción.",
      });
    }

    next();
  };
};
