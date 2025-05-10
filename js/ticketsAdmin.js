import {
    initializeApp,
    inputFilter,
    showMessage,
    showYesNoMessage,
    makeRequest,
    createModal,
    loadFile,
    showFormatMessage,
  } from "../utility.js";
  // import { fillUsuariosEncargados } from './main.js';
  
  // Crear un nuevo ticket
  document.getElementById("CrearTicket").addEventListener("click", function () {
    window.location.href = "tickets";
  });
  
  var ticketsEnPantalla = null;
  
  /// EJECUTA LA BUSQUEDA DE Tickets
  const queryTickets = async () => {
    const resultadoTickets = document.getElementById("ResultadoTickets");
    const modal = createModal("Tickets", "BUSCANDO...", "Espere...", "sm", false);
    modal.open = true;
  
    const response = await makeRequest("controllers/ticketsController.php", {
      type: "Query",
    });
    modal.open = false;
    setTimeout(() => {
      modal.remove();
    }, 10);
  
    if (response.error) {
      await showMessage("Tickets", "Error", response.data, true);
    } else {
      resultadoTickets.innerHTML = "";
      if (response.data.length > 0) {
        const checkboxes = document.querySelectorAll('input[name="estado"]');
        const checkboxesMarcados = Array.from(checkboxes).filter(
          (checkbox) => checkbox.checked
        );
        const valoresCheckboxesMarcados = checkboxesMarcados.map(
          (checkbox) => checkbox.value
        );
  
        const fechaSeleccionada = document.getElementById("fechaInicio").value;
  
        const datosFiltrados = response.data.filter((ticket) => {
          const fechaCreacion = ticket.FechaCreacionJS;
          const estadoCoincide = valoresCheckboxesMarcados.includes(
            ticket.Estado
          );
          const fechaCoincide =
            !fechaSeleccionada || fechaCreacion === fechaSeleccionada;
  
          return estadoCoincide && fechaCoincide;
        });
  
        // Mostrar los tickets filtrados
  
        ticketsEnPantalla = datosFiltrados;
        datosFiltrados.forEach((x) => {
          const tr = document.createElement("tr");
          const tdeditar = document.createElement("td");
          const deleteBtn = document.createElement("span");
          deleteBtn.className = "icon-delete_outline";
          deleteBtn.setAttribute("title", "Eliminar");
          const procesarBtn = document.createElement("span");
          procesarBtn.className = "icon-access_time";
          procesarBtn.setAttribute("title", "Empezar proceso");
          const cerrarBtn = document.createElement("span");
          cerrarBtn.className = "icon-spellcheck";
          cerrarBtn.setAttribute("title", "Aprobar y cerrar");
  
          const soporteBtn = document.createElement("span");
          soporteBtn.className =
            x.Soporte === 1 ? "icon-contact_support" : "icon-contact_support";
          soporteBtn.setAttribute(
            "title",
            x.Soporte === 1 ? "Desactivar Soporte" : "Activar Soporte"
          );
          soporteBtn.style.color = x.Soporte === 1 ? "gray" : "black";
  
          soporteBtn.onclick = function () {
            const nuevoEstadoSoporte = x.Soporte === 1 ? 0 : 1;
            toggleSoporte(x.Id, nuevoEstadoSoporte);
          };
  
          tdeditar.appendChild(deleteBtn);
          tdeditar.appendChild(procesarBtn);
          tdeditar.appendChild(cerrarBtn);
          tdeditar.appendChild(soporteBtn);
  
          const tdIdTicket = document.createElement("td");
          tdIdTicket.innerText = x.Id;
          const tdmatricula = document.createElement("td");
          tdmatricula.innerText = x.Aula;
          const tdnombre = document.createElement("td");
          tdnombre.innerText = x.Equipo;
          const tdDescripcion = document.createElement("td");
          tdDescripcion.innerText = x.Descripcion;
          tdDescripcion.style.maxWidth = "50px";
          tdDescripcion.style.wordWrap = "break-word";
          tdDescripcion.style.whiteSpace = "pre-line";
          const tdEstado = document.createElement("td");
          tdEstado.innerText = x.Estado;
  
          // Estilo según el estado
          switch (x.Estado) {
            case "CERRADO":
              tdEstado.style.backgroundColor = "#858585"; // Gris
              break;
            case "EN PROCESO":
              tdEstado.style.backgroundColor = "#c48002"; // Amarillo
              break;
            case "PENDIENTE":
              tdEstado.style.backgroundColor = "#df4343"; // Rojo
              break;
            case "RECHAZADO":
              tdEstado.style.backgroundColor = "#920c0c"; // Rojo más oscuro
              tdEstado.style.textDecoration = "underline"; // Subrayado
              break;
            case "APROBADO":
              tdEstado.style.backgroundColor = "#18792e"; // Verde
              break;
            default:
              tdEstado.style.backgroundColor = "#df4343"; // Rojo por defecto
              break;
          }
  
          const tdMotivo = document.createElement("td");
          tdMotivo.innerText = x.Motivo;
          tdMotivo.style.maxWidth = "50px";
          tdMotivo.style.wordWrap = "break-word";
          tdMotivo.style.whiteSpace = "pre-line";
          const tdCreador = document.createElement("td");
          tdCreador.innerText = x.Creador;
          tdCreador.style.maxWidth = "50px";
          tdCreador.style.wordWrap = "break-word";
          tdCreador.style.whiteSpace = "pre-line";
          const tdFechaCreacion = document.createElement("td");
          tdFechaCreacion.innerText = x.FechaCreacion;
          tdFechaCreacion.style.maxWidth = "50px";
          tdFechaCreacion.style.wordWrap = "break-word";
          tdFechaCreacion.style.whiteSpace = "pre-line";
          const tdFechaCierro = document.createElement("td");
          tdFechaCierro.innerText = x.FechaCierre;
          tdFechaCierro.style.maxWidth = "50px";
          tdFechaCierro.style.wordWrap = "break-word";
          tdFechaCierro.style.whiteSpace = "pre-line";
  
          const tdMotivoAdmin = document.createElement("td");
          tdMotivoAdmin.innerText = x.Motivo_Admin;
          tdMotivoAdmin.style.maxWidth = "50px";
          tdMotivoAdmin.style.wordWrap = "break-word";
          tdMotivoAdmin.style.whiteSpace = "pre-line";
  
          const tdAdministrador = document.createElement("td");
          tdAdministrador.innerText = x.Administrador;
          tdAdministrador.style.maxWidth = "10px";
  
          tr.appendChild(tdeditar);
          tr.appendChild(tdIdTicket);
          tr.appendChild(tdmatricula);
          tr.appendChild(tdnombre);
          tr.appendChild(tdDescripcion);
          tr.appendChild(tdEstado);
          tr.appendChild(tdMotivo);
          tr.appendChild(tdCreador);
          tr.appendChild(tdFechaCreacion);
          tr.appendChild(tdFechaCierro);
          tr.appendChild(tdMotivoAdmin);
          tr.appendChild(tdAdministrador);
          resultadoTickets.appendChild(tr);
  
          deleteBtn.onclick = () => deleteTicket(x.Id);
          procesarBtn.onclick = () => procesarTicket(x.Id);
          cerrarBtn.onclick = () => cerrarTicket(x.Id);
        });
      }
    }
  };
  queryTickets();
  
  /// ELIMINA UN TICKET
  const deleteTicket = async (id) => {
    const res = await showYesNoMessage(
      "Tickets",
      "ELIMINAR",
      "Está seguro de querer eliminar el ticket?",
      "sm"
    );
    if (res) {
      const modal = createModal(
        "Tickets",
        "ELIMINANDO...",
        "Espere...",
        "sm",
        false
      );
      modal.open = true;
      const response = await makeRequest("controllers/ticketsController.php", {
        type: "Delete",
        ...{
          id,
        },
      });
      modal.open = false;
      setTimeout(() => {
        modal.remove();
      }, 10);
      if (response.error) {
        await showMessage("Tickets", "Error", response.data, true);
      } else {
        await showMessage("Tickets", "ELIMINAR", response.data, true);
        await queryTickets();
      }
    }
  };
  /// PROCESA UN TICKET
  const procesarTicket = async (id) => {
    const res = await showYesNoMessage(
      "Tickets",
      "PROCESAR",
      "¿Está seguro de querer comenzar el proceso del ticket?",
      "sm"
    );
    if (res) {
      const modal = createModal(
        "Tickets",
        "COMENZANDO PROCESO...",
        "Espere...",
        "sm",
        false
      );
      modal.open = true;
      const response = await makeRequest("controllers/ticketsController.php", {
        type: "Procesar",
        ...{
          id,
        },
      });
      modal.open = false;
      setTimeout(() => {
        modal.remove();
      }, 10);
      if (response.error) {
        await showMessage("Tickets", "Error", response.data, true);
      } else {
        await showMessage("Tickets", "PROCESAR", response.data, true);
        await queryTickets();
      }
    }
  };
  /// CERRAR UN TICKET
  const cerrarTicket = async (id) => {
    const { value: motivo } = await Swal.fire({
      title: "Agrega el porqué se cerró",
      input: "textarea",
      inputPlaceholder: "Ingrese el motivo del cierre...",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      inputAttributes: {
        "aria-label": "Motivo del cierre",
        style: "height: 150px;",
      },
      inputValidator: (value) => {
        if (!value) {
          return "Por favor, ingrese un motivo para el cierre";
        }
      },
    });
  
    if (motivo) {
      const modal = createModal(
        "Tickets",
        "CERRANDO...",
        "Espere...",
        "sm",
        false
      );
      modal.open = true;
  
      const response = await makeRequest("controllers/ticketsController.php", {
        type: "Cerrar",
        ...{
          id,
          motivo,
        },
      });
  
      modal.open = false;
      setTimeout(() => {
        modal.remove();
      }, 10);
  
      if (response.error) {
        await showMessage("Tickets", "Error", response.data, true);
      } else {
        await showMessage("Tickets", "CERRAR", response.data, true);
        await queryTickets();
      }
    }
  };
  
  const toggleSoporte = async (id, soporte) => {
    const { value: confirmacion } = await Swal.fire({
      title: "Confirmar acción",
      text:
        soporte === 1
          ? "¿Estás seguro que deseas activar el soporte para este ticket?"
          : "¿Estás seguro que deseas desactivar el soporte para este ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar",
    });
  
    if (confirmacion) {
      const modal = createModal(
        "Tickets",
        "PROCESANDO...",
        "Espere...",
        "sm",
        false
      );
      modal.open = true;
  
      try {
        const response = await makeRequest("controllers/ticketsController.php", {
          type: "ToggleSoporte",
          id: id,
          soporte: soporte,
        });
  
        modal.open = false;
        setTimeout(() => {
          modal.remove();
        }, 10);
  
        if (response.error) {
          await Swal.fire({
            title: "Error",
            text: response.data,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        } else {
          await Swal.fire({
            title: "TICKET A SOPORTE",
            text:
              soporte === 1
                ? "El equipo de soporte ya puede ver este ticket"
                : "El equipo de soporte ya no puede ver este ticket",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          queryTickets();
        }
      } catch (error) {
        console.error(error);
        modal.open = false;
        setTimeout(() => {
          modal.remove();
        }, 10);
        await Swal.fire({
          title: "Error",
          text: "No se pudo completar la acción, por favor intente nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };
  
  // Filtros de los tickets en admin
  
  document.addEventListener("DOMContentLoaded", function () {
    var estadoContainer = document.getElementById("estadoContainer");
  
    var opciones = [
      "CERRADO",
      "APROBADO",
      "EN PROCESO",
      "PENDIENTE",
      "RECHAZADO",
    ];
  
    opciones.forEach(function (opcion) {
      // Crear el div contenedor
      var checkboxGroup = document.createElement("div");
      checkboxGroup.className = "form-check form-check-inline";
  
      // Crear el input tipo checkbox
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = opcion;
      checkbox.name = "estado";
      checkbox.value = opcion;
      checkbox.className = "checkbox-input d-flex";
  
      // Agregar la propiedad checked para marcar por defecto
      checkbox.checked = true;
  
      // Crear la etiqueta del checkbox
      var label = document.createElement("label");
      label.htmlFor = opcion;
      label.className = "checkbox-label";
      label.textContent = opcion;
  
      // Agregar el input y la etiqueta al div contenedor
      checkboxGroup.appendChild(checkbox);
      checkboxGroup.appendChild(label);
  
      // Agregar el div contenedor al contenedor principal
      estadoContainer.appendChild(checkboxGroup);
  
      // Agregar event listener para el cambio de los checkboxes
      checkbox.addEventListener("change", function () {
        queryTickets(); // Llama a queryTickets cuando cambia un checkbox
  
        // console.log("Ejecutando queryTickets...");
      });
    });
  
    // Agregar event listener para el botón "Marcar Todo"
    document
      .getElementById("marcarTodoBtn")
      .addEventListener("click", function () {
        marcarDesmarcarTodos(true);
      });
  
    // Agregar event listener para el botón "Desmarcar Todo"
    document
      .getElementById("desmarcarTodoBtn")
      .addEventListener("click", function () {
        marcarDesmarcarTodos(false);
      });
  
    // Función para marcar o desmarcar todos los checkboxes
    function marcarDesmarcarTodos(estado) {
      var checkboxes = document.querySelectorAll('input[name="estado"]');
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = estado;
      });
      queryTickets(); // Llama a queryTickets cuando cambia un checkbox
  
      // console.log("Ejecutando queryTickets...");
    }
  });
  
  // filtro de fecha
  document.addEventListener("DOMContentLoaded", function () {
    const filtroContainer = document.createElement("div");
    filtroContainer.className = "filtro-fechas-container mb-3";
  
    const fechaLabel = document.createElement("label");
    fechaLabel.setAttribute("for", "fechaInicio");
    fechaLabel.className = "text-white";
    fechaLabel.innerText = "Fecha de inicio:";
    filtroContainer.appendChild(fechaLabel);
  
    const fechaInicioInput = document.createElement("input");
    fechaInicioInput.type = "date";
    fechaInicioInput.id = "fechaInicio";
  
    fechaInicioInput.placeholder = "Fecha de inicio";
  
    fechaInicioInput.addEventListener("change", function () {
      queryTickets();
    });
  
    filtroContainer.appendChild(fechaInicioInput);
  
    const contenedorPrincipal =
      document.getElementById("estadoContainer").parentNode;
    contenedorPrincipal.insertBefore(
      filtroContainer,
      contenedorPrincipal.firstChild
    );
  });
  
  document
    .getElementById("ExportarTickets")
    .addEventListener("click", function () {
      const data = [];
  
      const headers = [
        "# De Petición (ID)",
        "Aula",
        "Equipo",
        "Descripcion",
        "Estado",
        "Motivo",
        "Creador",
        "Fecha de Creación",
        "Fecha de Cierre",
        "Motivo de cierre de Administrador",
        "Administrador que cerró el ticket",
      ];
      data.push(headers);
  
      ticketsEnPantalla.forEach((x) => {
        if (x.Motivo === "") x.Motivo = "N/A";
        if (x.Motivo_Admin === "") x.Motivo_Admin = "N/A";
  
        const row = [
          x.Id,
          x.Aula,
          x.Equipo,
          x.Descripcion,
          x.Estado,
          x.Motivo,
          x.Creador,
          x.FechaCreacion,
          x.FechaCierre,
          x.Motivo_Admin,
          x.Administrador,
        ];
        data.push(row);
      });
  
      // Crea una hoja de trabajo
      const ws = XLSX.utils.aoa_to_sheet(data);
  
      // Aplica estilos de colores al Estado
      /* data.forEach((row, rowIndex) => {
          if (rowIndex === 0) return;
          const estado = row[4];
          const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 4 }); 
  
          if (ws[cellAddress]) {
              ws[cellAddress].s = {
                  fill: {
                      fgColor: { rgb: estado === "CERRADO" ? "C6EFCE" : "FFC7CE" } 
                  },
                  font: {
                      color: { rgb: estado === "CERRADO" ? "006100" : "9C0006" },
                      bold: true
                  }
              };
          }
      }); */
  
      ws["!cols"] = headers.map(() => ({ width: 20 })); // Ajusta ancho de columnas
  
      //  agrega la hoja de trabajo
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tickets");
  
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
  
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "tickets.xlsx";
  
      // Simula un clic en el enlace para iniciar la descarga
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  
  // EXPORTACIÓN DE TICKETS ANTIGUA.
  
  /*  document.getElementById("ExportarTickets").addEventListener("click", function () {
      // Crea una matriz para almacenar los datos
      const data = [];
  
      // Agrega la primera fila con los encabezados
      const headers = ["Id", "Aula", "Equipo", "Descripcion", "Estado", "Motivo", "Creador", "FechaCreacion"];
      data.push(headers);
  
  
      // Recorre los datos y agrega cada fila a la matriz
      ticketsEnPantalla.forEach(x => {
  
          if (x.Motivo == ""){
              x.Motivo = "N/A";
          }
  
          if (x.Motivo_Admin == ""){
              x.Motivo_Admin = "N/A";
          }
  
          const row = [
              x.Id,
              x.Aula,
              x.Equipo,
              x.Descripcion,
              x.Estado,
              x.Motivo,
              x.Creador,
              x.FechaCreacion,
              x.FechaCierre,
              x.Motivo_Admin,
              x.Administrador
          ];
  
          // Escapa comas y comillas dentro de los campos de texto
          const escapedRow = row.map(field => typeof field === 'string' ? "${field.replace(/"/g, '""')}" : field);
          data.push(escapedRow);
      });
  
      // Convierte la matriz de datos a formato CSV
      const csvContent = data.map(row => row.join(",")).join("\n");
  
      // Crea un Blob con la codificación UTF-8
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  
      // Crea un enlace de descarga y asigna el Blob al enlace
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.target = '_blank';
      link.download = 'tickets.csv';
  
      // Simula un clic en el enlace para descargar el archivo CSV
      link.click();
  }); */