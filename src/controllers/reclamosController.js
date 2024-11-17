import ReclamosService from "../services/reclamosService.js";

const formatosPermitidos = ["pdf", "csv"];

export default class ReclamosController {
  constructor() {
    this.reclamosService = new ReclamosService();
  }
  //**** paginacion/// */
  buscarTodos = async (req, res) => {
    try {
      // Paginación: obtenemos los parámetros de la consulta (query params)
      const page = parseInt(req.query.page) || 1; // Página actual, es 1 es el numero de pagginas
      const limit = parseInt(req.query.limit) || 10; // Número de elementos por página, es 10 los numeros de registro por pagina y lo consulta por req.querry
      const offset = (page - 1) * limit; // el offste calcula con la page en -1 * limit para saber desde que registro comenzar

      // Llamar al servicio para obtener los reclamos con paginación
      const reclamos = await this.reclamosService.buscarTodos(offset, limit);

      // Obtener el total de reclamos para calcular cuántas páginas hay
      const totalReclamos = await this.reclamosService.contarReclamos();

      // Calcular el número total de páginas
      const totalPaginas = Math.ceil(totalReclamos / limit);

      // Responder con los reclamos y la información de paginación
      res.status(200).send({
        estado: "OK",
        data: reclamos,
        paginacion: {
          totalReclamos,
          totalPaginas,
          paginaActual: page,
          elementosPorPagina: limit,
        },
      });
    } catch (error) {
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
        error: error,
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
        error: error,
      });
    }
  };

  // No recibo el idReclamoEstado, al crear un nuevo reclamo siempre será de tipo 1 "creado"
  // fechaCreado lo hago con NOW() de MySQL
  crear = async (req, res) => {
    const { asunto, idReclamoTipo, idUsuarioCreador } = req.body;

    if (
      asunto === undefined ||
      idReclamoTipo === undefined ||
      idUsuarioCreador === undefined
    ) {
      return res.status(400).send({
        estado: "Falla",
        mensaje: "Faltan datos obligatorios.",
      });
    }

    try {
      const reclamo = {
        asunto,
        idReclamoTipo,
        idUsuarioCreador,
      };

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
      });
    }
  };

  modificar = async (req, res) => {
    try {
      const idReclamo = req.params.idReclamo;
      if (idReclamo === undefined) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Faltan datos obligatorios.",
        });
      }

      // Puede recibir uno o varios datos
      // Puedo reutilizar el método para la "atención" o "cancelación" de reclamos
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
      });
    }
  };

  atencionReclamo = async (req, res) => {
    try {
      const idReclamo = req.params.idReclamo;
      const idReclamoEstado = req.body.idReclamoEstado;

      if (idReclamoEstado === undefined) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Faltan datos obligatorios.",
        });
      }

      const dato = {
        idReclamoEstado,
      };

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
      });
    }
  };

  cancelacionReclamo = async (req, res) => {
    try {
      const idReclamo = req.params.idReclamo;

      // Verificar que se reciba el idReclamo
      const dato = {
        idReclamoEstado: 3,
        fechaCancelado: new Date().toISOString().slice(0, 19).replace("T", " "), // yyyy-mm-dd hh:mm:ss
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

      // Generar el informe
      const { buffer, path, headers } =
        await this.reclamosService.generarInforme(formato);

      res.set(headers);

      if (formato === "pdf") {
        res.status(200).end(buffer);
      } else if (formato === "csv") {
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
      console.log(error);
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
      });
    }
  };
}
