import Reclamos from "../database/reclamos.js";
import NotificacionesService from "./notificacionesService.js";

export default class ReclamosService {
  constructor() {
    this.reclamos = new Reclamos();
    this.notificaciones = new NotificacionesService();
  }
  // ***** paginacion *****
  // Método para obtener todos los reclamos con paginación

  buscarTodos = async (pagina = 1, limite = 10) => {
    // pagina y limite si no se pasa de valor 1 para pagina y valor 10 para limite
    const offset = (pagina - 1) * limite; // Calculamos el offset para la consulta aca depende de la pagina y el limite
    /// buscartodosconpaginacion lo tengo que poner en reclmos****
    const reclamos = await this.reclamos.buscarTodosConPaginacion(
      offset,
      limite // estos dos son para obtener la pagina especifica
    );
    const totalReclamos = await this.reclamos.contarTotalReclamos(); // cuento el total de reclamos para calcular el numero de paginas en total

    const totalPaginas = Math.ceil(totalReclamos / limite); // Calculamos el total de páginas

    return {
      reclamos,
      paginaActual: pagina,
      totalPaginas,
      totalReclamos,
      limite,
    };
  };

  buscarPorId = (idReclamo) => {
    return this.reclamos.buscarPorId(idReclamo);
  };

  crear = async (reclamo) => {
    const reclamoCreado = await this.reclamos.crear(reclamo);
    if (!reclamoCreado) {
      return { estado: false, mensaje: "Reclamo no creado" };
    }
    return { estado: true, mensaje: "Reclamo creado", data: reclamoCreado };
  };

  modificar = async (idReclamo, datos) => {
    const existe = await this.reclamos.buscarPorId(idReclamo);
    if (existe === null) {
      return { estado: false, mensaje: "idReclamo no existe" };
    }

    await this.reclamos.modificar(idReclamo, datos);
    return { estado: true, mensaje: "Reclamo modificado" };
  };

  atencionReclamo = async (idReclamo, datosReclamo) => {
    const existe = await this.reclamos.buscarPorId(idReclamo);
    if (existe === null) {
      return { estado: false, mensaje: "idReclamo no existe" };
    }

    const modificado = await this.reclamos.modificar(idReclamo, datosReclamo);
    if (!modificado) {
      return { estado: false, mensaje: "Reclamo no modificado" };
    }

    const cliente = await this.reclamos.buscarInformacionClientePorReclamo(
      idReclamo
    );
    if (!cliente) {
      return { estado: false, mensaje: "Faltan datos de cliente" };
    }

    const datosCorreo = {
      nombre: cliente[0].cliente,
      correoElectronico: cliente[0].correoElectronico,
      reclamo: idReclamo,
      estado: cliente[0].estado,
    };

    return await this.notificaciones.enviarCorreo(datosCorreo);
  };

  cancelacionReclamo = async (idReclamo, datosReclamo) => {
    const existe = await this.reclamos.sePuedeCancelar(idReclamo);
    if (existe === null) {
      return {
        estado: false,
        mensaje: "idReclamo no existe / Ya no se puede cancelar.",
      };
    }

    const modificado = await this.reclamos.modificar(idReclamo, datosReclamo);
    if (!modificado) {
      return { estado: false, mensaje: "Reclamo no cancelado" };
    }

    const cliente = await this.reclamos.buscarInformacionClientePorReclamo(
      idReclamo
    );
    if (!cliente) {
      return { estado: false, mensaje: "Faltan datos de cliente" };
    }

    const datosCorreo = {
      nombre: cliente[0].cliente,
      correoElectronico: cliente[0].correoElectronico,
      reclamo: idReclamo,
      estado: cliente[0].estado,
    };

    return await this.notificaciones.enviarCorreo(datosCorreo);
  };

  generarInforme = async (formato) => {
    if (formato === "pdf") {
      return await this.reportePdf();
    } else if (formato === "csv") {
      return await this.reporteCsv();
    }
  };

  reportePdf = async () => {
    const datosReporte = await this.reclamos.buscarDatosReportePdf();

    if (!datosReporte || datosReporte.length === 0) {
      return { estado: false, mensaje: "Sin datos para el reporte" };
    }

    const pdf = await this.informes.informeReclamosPdf(datosReporte);

    return {
      buffer: pdf,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="reporte.pdf"',
      },
    };
  };

  reporteCsv = async () => {
    const datosReporte = await this.reclamos.buscarDatosReporteCsv();

    if (!datosReporte || datosReporte.length === 0) {
      return { estado: false, mensaje: "Sin datos para el reporte" };
    }

    const csv = await this.informes.informeReclamosCsv(datosReporte);

    return {
      path: csv,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="reporte.csv"',
      },
    };
  };
}
