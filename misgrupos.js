import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile } from "./utility.js";


document.addEventListener("DOMContentLoaded", function() {
    init();
});


const init = () => {
    const semestresAlumno = document.getElementById('mgmSemestresAlumnos')
    fillSemestres(semestresAlumno, false);

    //const semestreInscripcionesAlumno = document.getElementById('mgmSemestresAlumnoss')
    //fillSemestres(semestreInscripcionesAlumno, false);

};


const fillSemestres = async (item, hasAll) => {
    const response = await makeRequest('gruposcontroller.php', {
        type: 'GetSemestres'
    });

    if (response.data.length > 0) {
        let html = hasAll ? "<option value='T' selected>TODOS</option>" : '';
        const firstRecord = response.data[0]; // OBTENER ULTIMO SEMESTRE DEL GRUPO CREADO
        html += `<option value='${firstRecord.Semestre}'>${firstRecord.Semestre}</option>`;
        item.innerHTML = html;
    }
};

const fillMateria = async (item, hasAll) => {
    const nombre = "";
    const response = await makeRequest("materiascontroller.php",
        {
            type: "Query",
            ...{
                nombre,
            }
        });
    if (response.data.length > 0) {
        let html = hasAll ? "<option value='T' selected>TODAS</option>" : "";
        response.data.forEach(x => html += `<option value='${x.Id}'>${x.Nombre}</option>`);
        item.innerHTML = html;
    }
}

const mat = document.getElementById("mgmateria");
if (mat) {
    fillMateria(mat, true);
}


const matInscripcion = document.getElementById("mgmateriaInscribir");
if (matInscripcion) {
    fillMateria(matInscripcion, true);
}

/// SE INSCRIBE A UN GRUPO
const deleteInscripcion = async (id, grupo) => {
    const res = await showYesNoMessage("MisGrupos", "DESINSCRIBIR",
        `¿Esta seguro de querer desinscribirse del grupo ${grupo.Nombre} de ${grupo.Materia}?`, "sm");
    if (res) {
        const modal = createModal("MisGrupos", "DESINSCRIBIENDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("gruposcontroller.php",
            {
                type: "Unroll",
                ...{
                    id
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("MisGrupos", "Error", response.data, true);
        }
        else {
            await showMessage("MisGrupos", "DESINSCRIBIR", response.data, true);
            await queryMisGrupos();
        }
    }
}

/// EJECUTA LA BUSQUEDA DE GRUPOS
const queryMisGrupos = async () => {
    const resultadoGrupos = document.getElementById("ResultadoMisGrupos");
    let materia = document.getElementById("mgmateria");
    let nombre = document.getElementById("mgnombre");
    let dia = document.getElementById("mgdia");
    let horainicio = document.getElementById("mghorainicio");
    let horafin = document.getElementById("mghorafin");
    let semestre = document.getElementById('mgmSemestresAlumnos')


    if (resultadoGrupos && materia && nombre && dia && horainicio && horafin) {
        materia = materia.value.trim();
        nombre = nombre.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        semestre = semestre.value.trim();
        const modal = createModal("MisGrupos", "BUSCANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("gruposcontroller.php",
            {
                type: "QueryUsuario",
                ...{
                    materia,
                    nombre,
                    dia,
                    horainicio,
                    horafin,
                    semestre
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("MisGrupos", "Error", response.data, true);
        }
        else {
            resultadoGrupos.innerHTML = "";
            if (response.data.length > 0) {
                response.data.forEach(x => {
                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");
                    const addBtn = document.createElement("span");
                    addBtn.className = "icon-delete_outline";
                    addBtn.setAttribute("title", "Desinscribirse");
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
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdmateria);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdaula);
                    tr.appendChild(tddia);
                    tr.appendChild(tdhorainicio);
                    tr.appendChild(tdhorafin);
                    resultadoGrupos.appendChild(tr);
                    addBtn.addEventListener("click", () => {
                        deleteInscripcion(x.Id, x);
                    });
                });
            }
        }
    }
}

const buscarMisGrupos = document.getElementById("BuscarMisGrupos");
if (buscarMisGrupos) {
    setTimeout(() => {
        queryMisGrupos();
    }, 100);
    buscarMisGrupos.addEventListener("click", () => {
        queryMisGrupos();
    });
}