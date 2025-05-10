import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile, showFormatMessage } from "../utility.js";



document.getElementById("BuscarReportesTickets").onclick = () => ejecutarReporte("QueryTickets");
document.getElementById("BuscarReportesMaterias").onclick = () => ejecutarReporte("QueryMaterias");

var TipoReporte = "";
var reporteExcel = null;

const ejecutarReporte = async (tipoReporte) => {
    const resultadoReportes = document.getElementById("ResultadoReportes");

    let url = '';
    let requestData = {};
    let thHeaders = [];

    switch (tipoReporte) {
        case "QueryTickets":
            requestData = "QueryTickets"
            thHeaders = ['Semestre', 'Tickets Totales en el Semestre', 'Tickets totales cerrados en el Semestre', 'Tickets destinados a Soporte en el Semestre', 'Efectividad de cerrado de Tickets'];
            TipoReporte = tipoReporte;
            break;
        case "QueryMaterias":
            requestData = "QueryMaterias"
            thHeaders = ['Semestre', 'Materia', 'Total de Alumnos inscritos'];
            TipoReporte = tipoReporte;
            break;
        default:
            showMessage(tipoReporte, "Error", "Tipo de reporte desconocido", true);
            return;
    }

    $.ajax({
        url: 'controllers/reportes_Controller.php',
        type: 'POST',
        data: JSON.stringify({
            type: requestData
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: (response) => {

            if (response.error) {
                showMessage(tipoReporte, "Error", response.data, true);
            } else {

                reporteExcel = null;

                resultadoReportes.innerHTML = "";

                if (response.data.length > 0) {
                    const thead = document.createElement("thead");
                    const tr = document.createElement("tr");

                    thHeaders.forEach((header) => {
                        const th = document.createElement("th");
                        th.innerText = header;
                        tr.appendChild(th);
                    });
                    thead.appendChild(tr);
                    resultadoReportes.appendChild(thead);

                    const tbody = document.createElement("tbody");

                    reporteExcel = response.data;

                    response.data.forEach((x) => {
                        const tr = document.createElement("tr");

                        if (tipoReporte === "QueryTickets") {
                            const tdSemestre = document.createElement("td");
                            tdSemestre.innerText = x.Semestre;

                            const tdTotalTickets = document.createElement("td");
                            tdTotalTickets.innerText = x.TotalTickets;

                            const tdTicketsCerrados = document.createElement("td");
                            tdTicketsCerrados.innerText = x.TicketsCerrados;

                            const tdTicketsSoporte = document.createElement("td");
                            tdTicketsSoporte.innerText = x.TicketsSoporte;

                            const tdPorcentajeEfectividad = document.createElement("td");
                            tdPorcentajeEfectividad.innerText = x.PorcentajeEfectividad + "%";

                            tr.appendChild(tdSemestre);
                            tr.appendChild(tdTotalTickets);
                            tr.appendChild(tdTicketsCerrados);
                            tr.appendChild(tdTicketsSoporte);
                            tr.appendChild(tdPorcentajeEfectividad);
                        } else if (tipoReporte === "QueryMaterias") {
                            const tdSemestre = document.createElement("td");
                            tdSemestre.innerText = x.Semestre;

                            const tdMateria = document.createElement("td");
                            tdMateria.innerText = x.Materia;

                            const tdTotalAlumnos = document.createElement("td");
                            tdTotalAlumnos.innerText = x.TotalAlumnos;

                            tr.appendChild(tdSemestre);
                            tr.appendChild(tdMateria);
                            tr.appendChild(tdTotalAlumnos);
                        }

                        tbody.appendChild(tr);
                    });

                    resultadoReportes.appendChild(tbody);
                } else {
                    showMessage(tipoReporte, "Sin Resultados", "No se encontraron datos", false);
                }
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            setTimeout(() => {
            }, 10);
            showMessage(tipoReporte, "Error", "Hubo un problema con la solicitud.", true);
        }
    });
};


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ExportarReportes").addEventListener("click", function () {
        const data = [];
        const headers = [];

        if (TipoReporte === "QueryTickets") {
            headers.push("Semestre", "Tickets Totales en el Semestre", "Tickets Totales Cerrados en el Semestre", "Tickets Destinados a Soporte en el Semestre", "Efectividad de Cerrado de Tickets");

            reporteExcel.forEach(x => {
                const row = [
                    x.Semestre,
                    x.TotalTickets,
                    x.TicketsCerrados,
                    x.TicketsSoporte,
                    x.PorcentajeEfectividad + "%"
                ];
                data.push(row);
            });
        } else if (TipoReporte === "QueryMaterias") {
            headers.push("Semestre", "Materia", "Total de Alumnos inscritos");

            reporteExcel.forEach(x => {
                const row = [
                    x.Semestre,
                    x.Materia,
                    x.TotalAlumnos
                ];
                data.push(row);
            });
        }
        else {
            return;
        }

        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!cols'] = headers.map(() => ({ width: 20 }));

        const wb = XLSX.utils.book_new();
        const sheetName = TipoReporte === "QueryTickets" ? "Tickets" : "Materias";
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/octet-stream" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = TipoReporte === "QueryTickets" ? "tickets.xlsx" : "materias.xlsx";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
