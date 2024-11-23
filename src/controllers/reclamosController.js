import ReclamosService from "../services/reclamosService.js";

const formatosPermitidos = ["pdf", "csv"];

export default class ReclamosController {
  constructor() {
    this.reclamosService = new ReclamosService();
  }

  /**
   * Método para buscar todos los reclamos con paginación.
   */
  buscarTodos = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Paginación desde query params con valores por defecto.

    try {
      // Parsear los valores de page y limit a números enteros.
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      if (
        // validacion comprueba que isNan sea un numero valido
        isNaN(pageNumber) ||
        isNaN(limitNumber) ||
        pageNumber < 1 || //valida que el numero de pagina sea mayor o igual a 1
        limitNumber < 1
      ) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Parámetros de paginación inválidos.",
        });
      }

      // Llamar al servicio con la paginación.
      const { data, total } = await this.reclamosService.buscarTodos({
        page: pageNumber,
        limit: limitNumber,
      });

      res.status(200).send({
        estado: "OK",
        data,
        meta: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      });
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };

  buscarPorId = async (req, res) => {
    const idReclamo = req.params.idReclamo;

    if (idReclamo === undefined) {
      return res.status(400).send({
        estado: "Falla",
        mensaje: "Faltan datos obligatorios.",
      });
    }

    try {
      const reclamo = await this.reclamosService.buscarPorId(idReclamo);
      res.status(200).send({ estado: "OK", data: reclamo });
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };

  crear = async (req, res) => {
    const { asunto, idReclamoTipo, idUsuarioCreador } = req.body; // valida el ausnto el idreclamo id usuario y que no sean undefined

    if (!asunto || !idReclamoTipo || !idUsuarioCreador) {
      return res.status(400).send({
        estado: "Falla",
        mensaje: "Faltan datos obligatorios.",
      });
    }

    try {
      const reclamo = { asunto, idReclamoTipo, idUsuarioCreador };
      const nuevoReclamo = await this.reclamosService.crear(reclamo);

      if (nuevoReclamo.estado) {
        res.status(201).send({ estado: "OK", data: nuevoReclamo.data });
      } else {
        res
          .status(404)
          .send({ estado: "Falla", mensaje: nuevoReclamo.mensaje });
      }
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };

  modificar = async (req, res) => {
    try {
      const idReclamo = req.params.idReclamo;
      if (!idReclamo) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Faltan datos obligatorios.",
        });
      }

      const datos = req.body;

      if (Object.keys(datos).length === 0) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "No se enviaron datos para ser modificados.",
        });
      }

      const reclamoModificado = await this.reclamosService.modificar(
        idReclamo,
        datos
      );

      if (reclamoModificado.estado) {
        res
          .status(200)
          .send({ estado: "OK", mensaje: reclamoModificado.mensaje });
      } else {
        res
          .status(404)
          .send({ estado: "Falla", mensaje: reclamoModificado.mensaje });
      }
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };

  atencionReclamo = async (req, res) => {
    try {
      const idReclamo = req.params.idReclamo;
      const idReclamoEstado = req.body.idReclamoEstado;

      if (!idReclamoEstado) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Faltan datos obligatorios.",
        });
      }

      const dato = { idReclamoEstado };
      const reclamoModificado = await this.reclamosService.atencionReclamo(
        idReclamo,
        dato
      );

      if (reclamoModificado.estado) {
        res
          .status(200)
          .send({ estado: "OK", mensaje: reclamoModificado.mensaje });
      } else {
        res
          .status(404)
          .send({ estado: "Falla", mensaje: reclamoModificado.mensaje });
      }
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };

  cancelacionReclamo = async (req, res) => {
    try {
      const idReclamo = req.params.idReclamo;
      const dato = {
        idReclamoEstado: 3,
        fechaCancelado: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      const reclamoCancelado = await this.reclamosService.cancelacionReclamo(
        idReclamo,
        dato
      );

      if (reclamoCancelado.estado) {
        res
          .status(200)
          .send({ estado: "OK", mensaje: reclamoCancelado.mensaje });
      } else {
        res
          .status(404)
          .send({ estado: "Falla", mensaje: reclamoCancelado.mensaje });
      }
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };

  informe = async (req, res) => {
    try {
      const formato = req.query.formato;
      if (!formato || !formatosPermitidos.includes(formato)) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Formato inválido para el informe.",
        });
      }

      const { buffer, path, headers } =
        await this.reclamosService.generarInforme(formato);

      res.set(headers);
      // decide que enviar si en pdf o en csv
      if (formato === "pdf") {
        res.status(200).end(buffer); // finaliza la respueta con el archivo pdf
      } else if (formato === "csv") {
        // inicia la descarga del archivo csv si hay error responde
        res.status(200).download(path, (err) => {
          if (err) {
            return res.status(500).send({
              estado: "Falla",
              mensaje: "No se pudo generar el informe.",
            });
          }
        });
      }
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error.message,
      });
    }
  };
}
