class ReclamosTipoController {
  constructor() {
    this.service = new ReclamosTipoService(); // accede a la base de datos
  }

  // todos los reclamos
  buscarTodos = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
      //  `page` y `limit`
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      // Calculamos el offset (es decir, cuántos resultados omitir)
      const offset = (pageNumber - 1) * limitNumber;

      // Obtener los reclamos paginados desde el servicio
      const reclamos = await this.service.obtenerReclamosPaginados(
        offset,
        limitNumber
      );

      // Obtener el total de reclamos para calcular el número total de páginas
      const totalReclamos = await this.service.obtenerTotalReclamos();
      const totalPages = Math.ceil(totalReclamos / limitNumber);

      // Envio los reclamos junto con la información de la paginación
      res.status(200).json({
        reclamos,
        totalPages,
        currentPage: pageNumber,
        totalReclamos,
      });
    } catch (error) {
      console.error("Error al obtener los reclamos:", error);
      res.status(500).json({ mensaje: "Error al obtener los reclamos" });
    }
  };

  // creo un reclamo
  crear = async (req, res) => {
    const nuevoReclamo = req.body;
    try {
      const reclamoCreado = await this.service.crearReclamo(nuevoReclamo);
      res.status(201).json(reclamoCreado);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al crear el reclamo" });
    }
  };
}

export default ReclamosTipoController;
