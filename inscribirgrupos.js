import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile } from "./utility.js";

const fillMateria = async (item, hasAll, carrera) => {
    console.log(carrera)
    const nombre = "";
    const response = await makeRequest("materiascontroller.php",
        {
            type: "QueryC",
            ...{
                nombre,
                carrera
            }
        });
    if (response.data.length > 0) {
        let html = hasAll ? "<option value='T' selected>TODAS</option>" : "";
        response.data.forEach(x => html += `<option value='${x.Id}'>${x.Nombre}</option>`);
        item.innerHTML = html;
    }
}

buscarGrupos();

function buscarGrupos() {
    const buscarInscribirGrupos = document.getElementById("BuscarInscribirGrupos");
    if (buscarInscribirGrupos) {
        setTimeout(() => {
            validarFechaRegistro(true)
        }, 100);

        buscarInscribirGrupos.addEventListener("click", () => {
            validarFechaRegistro(false)
        });
    }
}

/// SE INSCRIBE A UN GRUPO
const addInscripcion = async (id, grupo) => {
    const res = await showYesNoMessage("InscribirGrupo", "INSCRIBIR",
        `¿Esta seguro de querer inscribirse al grupo ${grupo.Nombre} de ${grupo.Materia}?`, "sm");
    if (res) {
        const modal = createModal("InscribirGrupo", "INSCRIBIENDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("gruposcontroller.php",
            {
                type: "Enroll",
                ...{
                    id
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("InscribirGrupo", "Error", response.data, true);
        }
        else {
            await showMessage("InscribirGrupo", "INSCRIBIR", response.data, true);
            const buscarMisGrupos = document.getElementById("BuscarMisGrupos");
            if (buscarMisGrupos) {
                buscarMisGrupos.click();
            }
        }
    }
}

/// EJECUTA LA BUSQUEDA DE GRUPOS
const queryInscribirGrupos = async () => {
    const resultadoGrupos = document.getElementById("ResultadoInscribirGrupos");
    let materia = document.getElementById("mgmateriaInscribir");
    let nombre = document.getElementById("ignombre");
    let aula = document.getElementById("igaula")
    let dia = document.getElementById("igdia");
    let horainicio = document.getElementById("ighorainicio");
    let horafin = document.getElementById("ighorafin");
    let matricula = '';
    let semestre = document.getElementById('mgmSemestresAlumnos')

    if (resultadoGrupos && materia && nombre && dia && horainicio && horafin) {
        materia = materia.value.trim();
        nombre = nombre.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        semestre = semestre.value.trim();
        const modal = createModal("InscribirGrupo", "BUSCANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("gruposcontroller.php",
            {
                type: "Query",
                ...{
                    materia,
                    nombre,
                    dia,
                    horainicio,
                    horafin,
                    matricula,
                    semestre
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("InscribirGrupo", "Error", response.data, true);
        }
        else {
            resultadoGrupos.innerHTML = "";
            if (response.data.length > 0) {
                response.data.forEach(x => {
                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");
                    const addBtn = document.createElement("span");
                    addBtn.className = "icon-unarchive";
                    addBtn.setAttribute("title", "Inscribirse");
                    tdeditar.appendChild(addBtn);
                    const tdmateria = document.createElement("td");
                    tdmateria.innerText = x.Materia;
                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = x.Nombre;
                    const tdaula = document.createElement("td");
                    tdaula.innerText = x.Aula;
                    const tddia = document.createElement("td");
                    tddia.innerText = x.Dia;
                    const tdhorainicio = document.createElement("td");
                    const ihora = x.HoraInicio.substr(0, 2);
                    const iminutos = x.HoraInicio.substr(2, 2);
                    tdhorainicio.innerText = `${ihora}:${iminutos}`;
                    const tdhorafin = document.createElement("td");
                    const fhora = x.HoraFin.substr(0, 2);
                    const fminutos = x.HoraFin.substr(2, 2);
                    tdhorafin.innerText = `${fhora}:${fminutos}`;
                    const tdinscritos = document.createElement("td");
                    tdinscritos.innerText = x.Inscritos;
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdmateria);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdaula);
                    tr.appendChild(tddia);
                    tr.appendChild(tdhorainicio);
                    tr.appendChild(tdhorafin);
                    tr.appendChild(tdinscritos);
                    resultadoGrupos.appendChild(tr);
                    addBtn.addEventListener("click", () => {
                        addInscripcion(x.Id, x);
                    });
                });
            }
        }
    }
}


async function fechas() {
    return $.ajax({
        url: "habilitarInscripcionController.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ type: "Query" }),
        dataType: "json",
        success: function (response) {
            if (response.error) {
                showMessage("InscribirGrupo", "Error", response.data, true);
                return [];
            } else {
                if (response.data.length > 0) {
                    const fechasArray = response.data.map(x => {
                        return { fechaInicio: x.fecha_inicio, fechaFin: x.fecha_fin };
                    });
                    return fechasArray;
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la petición AJAX:", error);
            showMessage("InscribirGrupo", "Error", "Ocurrió un error al procesar la solicitud", true);
        }
    });
}


async function validarFechaRegistro(primeraRevision) {

    const fechasArray = await fechas();
    // console.log("FECHAS")
    if (fechasArray) {
        const fechaInicio = fechasArray.data[0].fecha_inicio;
        const fechaFin = fechasArray.data[0].fecha_fin;
        // Utilizar el valor de fechaInicio en tu lógica de validación
        // console.log("Fecha de inicio: " + fechaInicio);
        // console.log("Fecha de fin: " + fechaFin);

        const fechaBaseDatosInicio = new Date(fechaInicio); // La fecha recibida desde la base de datos, asegúrate de que esté en el formato correcto
        const fechaBaseDatosFin = new Date(fechaFin); // La fecha recibida desde la base de datos, asegúrate de que esté en el formato correcto

        const fechaActual = new Date(); // Fecha actual

        // console.log(fechaBaseDatosInicio)
        // console.log(fechaActual)
        // console.log(fechaBaseDatosFin)
        // console.log(fechaCorrecta)

        if (fechaActual >= fechaBaseDatosInicio && fechaActual <= fechaBaseDatosFin) {
            // La fecha actual es igual o mayor a la fecha de la base de datos
            queryInscribirGrupos();

            if (primeraRevision) {
                Swal.fire({
                    icon: 'question',
                    title: '¿Desea inscribirse a un nuevo grupo?',
                    showDenyButton: true,
                    // showCancelButton: true,
                    confirmButtonText: 'Sí, quiero inscribirme',
                    allowOutsideClick: false,
                    confirmButtonColor: '#0DE5FF',
                    background: '#1F2540',
                    color: '#ffffff',
                    denyButtonText: `No, ver mis grupos`,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        // Swal.fire('Saved!', '', 'success')


                        setElementActive("MisGrupos", "MisGrupos", false);
                        setElementActive("InscribirGrupo", "InscribirGrupo", true);




                    } else if (result.isDenied) {
                        //   Swal.fire('Changes are not saved', '', 'info')
                    }
                })
                document.body.className = '';
            }

        } else {
            // La fecha actual es menor a la fecha de la base de datos
            // Realiza alguna otra acción o muestra un mensaje de error
            function formatearFecha(timestamp) {
                const fecha = new Date(timestamp);
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const anio = fecha.getFullYear().toString();
                const fechaFormateada = `${dia}/${mes}/${anio}`;
                return fechaFormateada;
            }

            function formatearHoraFecha(timestamp) {
                const fecha = new Date(timestamp);
                const horas = fecha.getHours().toString().padStart(2, '0');
                const minutos = fecha.getMinutes().toString().padStart(2, '0');
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const anio = fecha.getFullYear().toString();
                const fechaHoraFormateada = `${horas}:${minutos}h del ${dia}/${mes}/${anio}`;
                return fechaHoraFormateada;
            }


            if (fechaActual < fechaBaseDatosInicio) {
                var fechaFormateada = formatearFecha(fechaInicio);
                var fechaFormateadaHora = formatearHoraFecha(fechaInicio);
                // console.log(fechaFormateada);
                Swal.fire({
                    icon: 'error',
                    title: 'La fecha de inscripción es el ' + fechaFormateada,
                    text: 'Regresa a partir de las ' + fechaFormateadaHora,
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    confirmButtonColor: '#0DE5FF',
                    background: '#1F2540',
                    color: '#ffffff',
                })
                document.body.className = '';
            }
            else if (fechaActual > fechaBaseDatosFin) {
                var fechaFormateada = formatearHoraFecha(fechaFin);
                // console.log(fechaFormateada);
                Swal.fire({
                    icon: 'error',
                    title: 'La fecha de inscripción terminó a las ' + fechaFormateada,
                    // text: 'Se cerró la incripción a partir de las: ' + fechaFormateada,
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    confirmButtonColor: '#0DE5FF',
                    background: '#1F2540',
                    color: '#ffffff'
                })
                document.body.className = '';

            }
        }

    } else {
        console.log("No hay fecha de inicio, ni fin");
    }
}

function setElementActive(elementId, elementRef, isActive) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute("active", isActive.toString());
    }
    const tabElement = document.querySelector(`div[slot="items"][ref="${elementRef}"]`);
    if (tabElement) {
        tabElement.setAttribute("active", isActive.toString());
    }
}