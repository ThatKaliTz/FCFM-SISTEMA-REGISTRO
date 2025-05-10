// ----------------------------------------
// tab inscripciones
// ----------------------------------------

import { showMessage, showYesNoMessage, makeRequest, createModal, loadFile } from "./utility.js";
import { fillMaterias } from './main.js';

const slDia2 = document.getElementById('agdia');
const slHoraInicio2 = document.getElementById('aghorainicio');
const slHoraFin2 = document.getElementById('aghorafin');
const slMaterias2 = document.getElementById('agmateria');
const slGruposMaterias = document.getElementById('slGruposMateria');
const matAlumnosGrupo = document.getElementById("agmateria");
const btnFiltrarAlumno = document.getElementById('btnFiltrarAlumno');
const btnLimpiarAlumno = document.getElementById('btnLimpiarAlumno');
const btnBuscarGruposPorAlumno = document.getElementById("btnBuscarGruposPorAlumno");
const mdlBuscarAlumno = document.getElementById('mdlBuscarAlumno');
const btnMostrarInsAlumno = document.getElementById('btnMostrarInsAlumno');
const mdlInsAlumno = document.getElementById('mdlInsAlumno');
const iaMaterias = document.getElementById('iaMateria');
const iaGruposMateria = document.getElementById('iaGruposMateria');
const iaMatricula = document.getElementById('iaMatricula');
const btnInscribirAlumno = document.getElementById('btnInscribirAlumno');
const iaMensaje = document.getElementById('iaMensaje');

document.addEventListener("DOMContentLoaded", function () {
    init();
});


const fillGruposMaterias = async (select, idMateria) => {

    let semestre = document.getElementById("mgmsemestregrupos").value.trim();

    const response = await makeRequest("gruposcontroller.php", {
        type: "QueryGruposMateria",
        ...{
            idMateria,
            semestre
        }
    });

    if (response.data.length > 0) {
        let html = "<option value='0'>TODOS</option>";
        response.data.forEach(x => html += `<option value='${x.Id}'>${x.Nombre}</option>`);
        select.innerHTML = html;
    } else {
        select.innerHTML = `<option value="0">No cuenta con grupos</option>"`;
    }
};



// load
const init = () => {

    const semestres = document.getElementById('mgmsemestregrupos')


    fillMaterias(matAlumnosGrupo, true);
    fillMaterias(iaMaterias, true);
    fillSemestres(semestres, false);


    slDia2.addEventListener('change', () => {

        let dia = slDia2.options[slDia2.selectedIndex].value;

        if (dia === 'TS') {

            slHoraInicio2.value = '0700';
            slHoraFin2.value = '2200';

            slHoraInicio2.disabled = true;
            slHoraFin2.disabled = true;

        } else {

            slHoraInicio2.disabled = false;
            slHoraFin2.disabled = false;
        }
    });

    btnFiltrarAlumno.addEventListener('click', () => {
        mdlBuscarAlumno.open = true;
    });

    btnLimpiarAlumno.addEventListener('click', () => {
        let mgalumno = document.getElementById('mgalumno');
        mgalumno.value = '';
    });

    slMaterias2.addEventListener('change', () => {
        onMateriasSelectedItemChanged(slMaterias2, slGruposMaterias);
    });

    iaMaterias.addEventListener('change', () => {
        onMateriasSelectedItemChanged(iaMaterias, iaGruposMateria);
    });

    btnBuscarGruposPorAlumno.addEventListener("click", () => {
        queryGruposPorAlumno();
    });

    btnMostrarInsAlumno.addEventListener('click', () => {
        mdlInsAlumno.open = true;
    });

    btnInscribirAlumno.addEventListener('click', () => {
        onBtnInscribirAlumnoClick();
    });

    queryGruposPorAlumno();
    
};


const semestreSelect = document.getElementById("mgmsemestregrupos");

semestreSelect.addEventListener("change", function() {
    onMateriasSelectedItemChanged(slMaterias2, slGruposMaterias); 
});




window.addEventListener("load", init, true);

const onBtnInscribirAlumnoClick = () => {

    // obtenemos datos
    let inscripcion = {
        idMateria: parseInt(iaMaterias.options[iaMaterias.selectedIndex].value),
        idGrupo: parseInt(iaGruposMateria.options[iaGruposMateria.selectedIndex].value),
        matriculaAlumno: parseInt(iaMatricula.value)
    };

    iaMensaje.innerHTML = '';

    // validamos
    if (!inscripcion.idMateria || inscripcion.idMateria <= 0) {
        iaMensaje.innerHTML = 'Seleccione la materia';
        return;
    }

    if (!inscripcion.idGrupo || inscripcion.idGrupo <= 0) {
        iaMensaje.innerHTML = 'Seleccione el grupo';
        return;
    }

    if (!inscripcion.matriculaAlumno || inscripcion.matriculaAlumno <= 0) {
        iaMensaje.innerHTML = 'Ingrese la matrícula del alumno';
        return;
    }

    // confirmamos
    let materia = iaMaterias.options[iaMaterias.selectedIndex].text;
    let grupo = iaGruposMateria.options[iaGruposMateria.selectedIndex].text;

    let op = showYesNoMessage('AlumnoGrupos', 'Confirmación', `La matricula ${inscripcion.matriculaAlumno} se inscribirá en el ` +
        `grupo ${grupo} de la materia ${materia}, ¿Desea continuar?`, 'sm');

    op.then((result) => {

        if (!result) {
            return;
        }

        // inscribimos
        addInscripcion(inscripcion);
    });
};

const onMateriasSelectedItemChanged = (selectMaterias, selectGrupos) => {

    let idMateria = selectMaterias.options[selectMaterias.selectedIndex].value;
    selectGrupos.disabled = idMateria == null || idMateria === undefined || idMateria === 'T' || idMateria <= 0;

    selectGrupos.innerHTML = "";

    idMateria = idMateria === 'T' ? 0 : parseInt(idMateria);

    if (!selectGrupos.disabled) {
        fillGruposMaterias(selectGrupos, idMateria);
    } else {
        selectGrupos.innerHTML = `<option value="0">Seleccione una materia</option>`;
    }
};




const queryGruposPorAlumno = async () => {

    const resultadoGrupos = document.getElementById("ResultadoAlumnoGrupos");
    let materia = document.getElementById("agmateria");
    let nombre = document.getElementById("agnombre");
    let dia = document.getElementById("agdia");
    let horainicio = document.getElementById("aghorainicio");
    let horafin = document.getElementById("aghorafin");
    let matricula = document.getElementById("mgalumno");
    let grupo = document.getElementById('slGruposMateria');
    let semestre = document.getElementById("mgmsemestregrupos");


    if (resultadoGrupos && materia && nombre && dia && horainicio && horafin) {

        materia = materia.value.trim();
        nombre = nombre.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        matricula = matricula.value.trim();
        grupo = grupo.value.trim();
        semestre = semestre.value.trim();

        const modal = createModal("AlumnoGrupos", "BUSCANDO...", "Espere...", "sm", false);
        modal.open = true;

        const response = await makeRequest("gruposcontroller.php",
            {
                type: "QueryGruposPorAlumno",
                ...{
                    materia,
                    nombre,
                    dia,
                    horainicio,
                    horafin,
                    matricula,
                    grupo,
                    semestre
                }
            });

        modal.open = false;

        setTimeout(() => {
            modal.remove();
        }, 10);

        if (response.error) {
            await showMessage("AlumnoGrupos", "Error", response.data, true);
        }
        else {

            resultadoGrupos.innerHTML = "";

            if (response.data.length > 0) {

                console.log(response.data);

                response.data.forEach(x => {

                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");

                    const addBtn = document.createElement("span");
                    addBtn.className = "icon-delete_outline";
                    addBtn.setAttribute("title", "Retirar inscripción");

                    tdeditar.appendChild(addBtn);

                    const tdmatricula = document.createElement("td");
                    tdmatricula.innerText = x.Matricula;

                    const tdalumno = document.createElement("td");
                    tdalumno.innerText = x.Alumno;

                    const tdmateria = document.createElement("td");
                    tdmateria.innerText = x.Materia;

                    const tdaula = document.createElement("td");
                    tdaula.innerText = x.Aula;

                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = x.Nombre;

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

                    tr.appendChild(tdeditar);
                    tr.appendChild(tdmatricula);
                    tr.appendChild(tdalumno);
                    tr.appendChild(tdmateria);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdaula);
                    tr.appendChild(tddia);
                    tr.appendChild(tdhorainicio);
                    tr.appendChild(tdhorafin);

                    resultadoGrupos.appendChild(tr);

                    addBtn.addEventListener("click", () => {
                        deleteInscripcion(x);
                    });
                });
            }
        }
    }
}

const addInscripcion = async (inscripcion) => {

    const modal = createModal("AlumnoGrupos", "INSCRIBIENDO...", "Espere...", "sm", false);
    modal.open = true;

    const response = await makeRequest("gruposcontroller.php",
        {
            type: "Adminenroll",
            inscripcion
        });

    modal.open = false;

    setTimeout(() => {
        modal.remove();
    }, 10);

    if (response.error) {
        await showMessage("AlumnoGrupos", "Error", response.data, true);
    }
    else {
        await showMessage("AlumnoGrupos", "INSCRIBIR", response.data, true);
        limpiarModalInscripcion();
        queryGruposPorAlumno();
    }
};

const deleteInscripcion = async (inscripcion) => {

    const res = await showYesNoMessage("AlumnoGrupos", "DESINSCRIBIR",
        `¿Esta seguro de querer desinscribir al alumno ${inscripcion.Alumno} del grupo ${inscripcion.Nombre} de ${inscripcion.Materia}?`, "sm");

    if (!res) {
        return;
    }

    const modal = createModal("AlumnoGrupos", "DESINSCRIBIENDO...", "Espere...", "sm", false);
    modal.open = true;

    let idGrupo = inscripcion.Id;
    let matriculaAlumno = inscripcion.Matricula;

    const response = await makeRequest("gruposcontroller.php",
        {
            type: "Adminunroll",
            ...{
                idGrupo,
                matriculaAlumno
            }
        });

    modal.open = false;

    setTimeout(() => {
        modal.remove();
    }, 10);

    if (response.error) {
        await showMessage("AlumnoGrupos", "Error", response.data, true);
    }
    else {
        await showMessage("AlumnoGrupos", "DESINSCRIBIR", response.data, true);
        queryGruposPorAlumno();
    }
}

const limpiarModalInscripcion = () => {

    iaGruposMateria.innerHTML = '<option value="0">Seleccione una materia</option>';
    iaGruposMateria.disabled = true;
    iaMaterias.selectedIndex = 0;
    iaMatricula.value = '';
};


async function fechas() {
    const response = await makeRequest("habilitarInscripcionController.php",
        {
            type: "Query",
            ...{}
        });
    if (response.error) {
        await showMessage("InscribirGrupo", "Error", response.data, true);
    }
    else {
        // resultadoGrupos.innerHTML = "";
        if (response.data.length > 0) {
            const fechasArray = response.data.map(x => {
                return { fechaInicio: x.fecha_inicio, fechaFin: x.fecha_fin };
            });
            return fechasArray;
        }
    }
}


const fillSemestres = async (item, hasAll) => {
    const nombre = '';
    const response = await makeRequest('gruposcontroller.php', {
        type: 'GetSemestres'
    });

    if (response.data.length > 0) {
        let html = hasAll ? "<option value='T' selected>TODOS</option>" : '';
        console.log(response.data);
        response.data.forEach(
            x => (html += `<option value='${x.Semestre}'>${x.Semestre}</option>`)
        );
        item.innerHTML = html;
    }
};

document.getElementById('btnHorariosInscripcion').addEventListener('click', function () {
    $.ajax({
        type: 'POST',
        url: 'habilitarInscripcionController.php',
        data: JSON.stringify({
            type: 'Query'
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            if (response.error) {
                Swal.fire({
                    title: 'Error',
                    text: response.data,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#408DFC',
                    background: '#1F2540',
                    color: '#ffffff',
                });
            } else {
                const fechaInicio = response.data[0].fecha_inicio || '';
                const fechaFin = response.data[0].fecha_fin || '';

                Swal.fire({
                    title: 'Configurar Fechas de Clases',
                    html: `
                    <label for="fechaInicio">Fecha y Hora de Inicio de inscripciones:</label>
                    <input type="datetime-local" id="fechaInicioInscripcion" class="swal2-input" value="${fechaInicio}" />
                    <br />
                    <label for="fechaFin">Fecha y Hora de Fin de inscripciones:</label>
                    <input type="datetime-local" id="fechaFinInscripcion" class="swal2-input" value="${fechaFin}" />
                  `,
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#408DFC',
                    background: '#1F2540',
                    color: '#ffffff',
                    preConfirm: () => {
                        const fechaInicio = document.getElementById('fechaInicioInscripcion').value;
                        const fechaFin = document.getElementById('fechaFinInscripcion').value;

                        if (!fechaInicio || !fechaFin) {
                            Swal.showValidationMessage('Por favor complete ambos campos');
                            return;
                        }

                        return { fechaInicio, fechaFin };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const formValues = result.value;

                        $.ajax({
                            type: 'POST',
                            url: 'habilitarInscripcionController.php',
                            data: JSON.stringify({
                                type: 'SetHorarioInscripcion', 
                                fecha_inicio: formValues.fechaInicio,
                                fecha_fin: formValues.fechaFin
                            }),
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (response) {
                                if (response.error) {
                                    Swal.fire({
                                        title: 'Error',
                                        text: response.data,
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#408DFC',
                                        background: '#1F2540',
                                        color: '#ffffff',
                                    });
                                } else {
                                    Swal.fire({
                                        title: 'Fechas actualizadas',
                                        text: response.data,
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#408DFC',
                                        background: '#1F2540',
                                        color: '#ffffff',
                                    });
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error('Error al actualizar fechas:', error);
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Hubo un problema al comunicarse con el servidor. Inténtelo de nuevo.',
                                    icon: 'error',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#408DFC',
                                    background: '#1F2540',
                                    color: '#ffffff',
                                });
                            }
                        });
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener fechas:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al obtener las fechas desde el servidor. Inténtelo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});


