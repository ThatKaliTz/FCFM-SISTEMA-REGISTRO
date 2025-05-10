import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile, showFormatMessage } from "../utility.js";
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
    const response = await makeRequest("controllers/ticketsController.php",
        {
            type: "QuerySoporte",
            ...{
            }
        });
    modal.open = false;
    setTimeout(() => {
        modal.remove();
    }, 10);
    if (response.error) {
        await showMessage("Tickets", "Error", response.data, true);
    }
    else {
        // console.log("No error")

        resultadoTickets.innerHTML = "";
        if (response.data.length > 0) {
            // Obtén todos los checkboxes
            const checkboxes = document.querySelectorAll('input[name="estado"]');

            // Filtra los checkboxes marcados
            const checkboxesMarcados = Array.from(checkboxes).filter(checkbox => checkbox.checked);

            // Obtén los valores de los checkboxes marcados
            const valoresCheckboxesMarcados = checkboxesMarcados.map(checkbox => checkbox.value);

            // Filtra los datos según los valores de los checkboxes marcados
            const datosFiltrados = response.data.filter(ticket => valoresCheckboxesMarcados.includes(ticket.Estado));

            // console.log(datosFiltrados)
            ticketsEnPantalla = datosFiltrados;
            // console.log(ticketsEnPantalla)

            // Verificar si todos los motivos son vacíos o nulos
            // const todosMotivosSonNulos = response.data.every(item => !item.Motivo || item.Motivo.trim() === '');

            datosFiltrados.forEach(x => {
                const tr = document.createElement("tr");
                const tdeditar = document.createElement("td");
                
                const procesarBtn = document.createElement("span");
                procesarBtn.className = "icon-access_time";
                procesarBtn.setAttribute("title", "Empezar proceso");
                const cerrarBtn = document.createElement("span");
                cerrarBtn.className = "icon-spellcheck";
                cerrarBtn.setAttribute("title", "Aprobar y cerrar");


                tdeditar.appendChild(procesarBtn);
                tdeditar.appendChild(cerrarBtn);

                const tdIdTicket = document.createElement("td");
                tdIdTicket.innerText = x.Id;
                const tdmatricula = document.createElement("td");
                tdmatricula.innerText = x.Aula;
                const tdnombre = document.createElement("td");
                tdnombre.innerText = x.Equipo;
                const tdDescripcion = document.createElement("td");
                tdDescripcion.innerText = x.Descripcion;
                tdDescripcion.style.maxWidth = '50px';
                tdDescripcion.style.wordWrap = 'break-word';
                tdDescripcion.style.whiteSpace = 'pre-line';
                const tdEstado = document.createElement("td");
                tdEstado.innerText = x.Estado;

                switch (x.Estado) {
                    case 'CERRADO':
                        tdEstado.style.backgroundColor = '#858585'; // Gris
                        break;
                    case 'EN PROCESO':
                        tdEstado.style.backgroundColor = '#c48002'; // Amarillo
                        break;
                    case 'PENDIENTE':
                        tdEstado.style.backgroundColor = '#df4343'; // Rojo
                        break;
                    case 'RECHAZADO':
                        tdEstado.style.backgroundColor = '#920c0c'; // Rojo más oscuro
                        tdEstado.style.textDecoration = 'underline'; // Subrayado
                        break;
                    case 'APROBADO':
                        tdEstado.style.backgroundColor = '#18792e'; // Verde
                        break;
                    default:
                        tdEstado.style.backgroundColor = '#df4343'; // Rojo por defecto
                        break;
                }

                const tdMotivo = document.createElement("td");
                // if (!todosMotivosSonNulos) {
                // tdMotivo = document.createElement("td");
                tdMotivo.innerText = x.Motivo;
                tdMotivo.style.maxWidth = '50px';
                tdMotivo.style.wordWrap = 'break-word';
                tdMotivo.style.whiteSpace = 'pre-line';
                // }
                const tdCreador = document.createElement("td");
                tdCreador.innerText = x.Creador;
                tdCreador.style.maxWidth = '50px';
                tdCreador.style.wordWrap = 'break-word';
                tdCreador.style.whiteSpace = 'pre-line';
                const tdFechaCreacion = document.createElement("td");
                tdFechaCreacion.innerText = x.FechaCreacion;
                tdFechaCreacion.style.maxWidth = '50px';
                tdFechaCreacion.style.wordWrap = 'break-word';
                tdFechaCreacion.style.whiteSpace = 'pre-line';
                const tdFechaCierro = document.createElement("td");
                tdFechaCierro.innerText = x.FechaCierre;
                tdFechaCierro.style.maxWidth = '50px';
                tdFechaCierro.style.wordWrap = 'break-word';
                tdFechaCierro.style.whiteSpace = 'pre-line';

                const tdMotivoAdmin = document.createElement("td");
                // if (!todosMotivosSonNulos) {
                // tdMotivo = document.createElement("td");
                tdMotivoAdmin.innerText = x.Motivo_Admin;
                tdMotivoAdmin.style.maxWidth = '50px';
                tdMotivoAdmin.style.wordWrap = 'break-word';
                tdMotivoAdmin.style.whiteSpace = 'pre-line';

                const tdAdministrador = document.createElement("td");
                tdAdministrador.innerText = x.Administrador;
                tdAdministrador.style.maxWidth = '10px';




                tr.appendChild(tdeditar);
                tr.appendChild(tdIdTicket);
                tr.appendChild(tdmatricula);
                tr.appendChild(tdnombre);
                tr.appendChild(tdDescripcion);
                tr.appendChild(tdEstado);
                // Agregar la columna Motivo solo si no son todos nulos
                // if (!todosMotivosSonNulos) {
                tr.appendChild(tdMotivo);
                // }
                tr.appendChild(tdCreador);
                tr.appendChild(tdFechaCreacion);
                tr.appendChild(tdFechaCierro);
                tr.appendChild(tdMotivoAdmin);
                tr.appendChild(tdAdministrador);
                resultadoTickets.appendChild(tr);

                procesarBtn.onclick = () => procesarTicket(x.Id);
                cerrarBtn.onclick = () => cerrarTicket(x.Id);

            });
        }
    }
}

queryTickets();

/// PROCESA UN TICKET
const procesarTicket = async (id) => {
    const res = await showYesNoMessage("Tickets", "PROCESAR", "¿Está seguro de querer comenzar el proceso del ticket?", "sm");
    if (res) {
        const modal = createModal("Tickets", "COMENZANDO PROCESO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("controllers/ticketsController.php",
            {
                type: "Procesar",
                ...{
                    id
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Tickets", "Error", response.data, true);
        }
        else {
            await showMessage("Tickets", "PROCESAR", response.data, true);
            await queryTickets();
        }
    }
}
/// CERRAR UN TICKET
const cerrarTicket = async (id) => {
    const { value: motivo } = await Swal.fire({
        title: 'Agrega el porqué se cerró',
        input: 'textarea',
        inputPlaceholder: 'Ingrese el motivo del cierre...',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        inputAttributes: {
            'aria-label': 'Motivo del cierre',
            style: 'height: 150px;'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingrese un motivo para el cierre';
            }
        }
    });

    if (motivo) {
        const modal = createModal("Tickets", "CERRANDO...", "Espere...", "sm", false);
        modal.open = true;

        const response = await makeRequest("controllers/ticketsController.php", {
            type: "Cerrar",
            ...{
                id,
                motivo
            }
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




// Filtros de los tickets en admin

document.addEventListener("DOMContentLoaded", function () {
    var estadoContainer = document.getElementById("estadoContainer");

    var opciones = ["CERRADO", "APROBADO", "EN PROCESO", "PENDIENTE", "RECHAZADO"];

    opciones.forEach(function (opcion) {
        // Crear el div contenedor
        var checkboxGroup = document.createElement("div");
        checkboxGroup.className = "checkbox-group";

        // Crear el input tipo checkbox
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = opcion;
        checkbox.name = "estado";
        checkbox.value = opcion;
        checkbox.className = "checkbox-input";

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
    document.getElementById("marcarTodoBtn").addEventListener("click", function () {
        marcarDesmarcarTodos(true);
    });

    // Agregar event listener para el botón "Desmarcar Todo"
    document.getElementById("desmarcarTodoBtn").addEventListener("click", function () {
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

// Exportar tickets que se muestran en pantalla a un excel
document.getElementById("ExportarTickets").addEventListener("click", function () {
    // Crea una matriz para almacenar los datos
    const data = [];

    // Agrega la primera fila con los encabezados
    const headers = ["Id", "Aula", "Equipo", "Descripcion", "Estado", "Motivo", "Creador", "FechaCreacion"];
    data.push(headers);

    // Recorre los datos y agrega cada fila a la matriz
    ticketsEnPantalla.forEach(x => {
        const row = [
            x.Id,
            x.Aula,
            x.Equipo,
            x.Descripcion,
            x.Estado,
            x.Motivo,
            x.Creador,
            x.FechaCreacion
        ];

        // Escapa comas y comillas dentro de los campos de texto
        const escapedRow = row.map(field => typeof field === 'string' ? `"${field.replace(/"/g, '""')}"` : field);
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
});













