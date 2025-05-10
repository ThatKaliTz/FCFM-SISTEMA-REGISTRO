// ----------------------------------------
// tab grupos
// ----------------------------------------

import { inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile } from "./utility.js";
import { fillMaterias } from './main.js';

const mmat = document.getElementById("mgmmateria");
const mat = document.getElementById("mgmateria");
const mgmca = document.getElementById("mgmcapacidad");
const grupoGuardar = document.getElementById("GrupoGuardar");
const buscarGrupos = document.getElementById("BuscarGrupos");
const agregarGrupos = document.getElementById("AgregarGrupos");
const importarGrupos = document.getElementById("ImportarGrupos");
const slDia = document.getElementById('mgdia');
const slHoraInicio = document.getElementById('mghorainicio');
const slHoraFin = document.getElementById('mghorafin');
const mmaestro = document.getElementById("mgmmaestro");

document.addEventListener("DOMContentLoaded", function() {
    init();
});


// load
const init = () => {


    const semestres = document.getElementById('mgmsemestre')


    fillMaterias(mmat, false);
    fillMaterias(mat, true);
    inputFilter(mgmca, value => /^\d*$/.test(value));

    fillSemestres(semestres, false);

    grupoGuardar.onclick = addEditGrupo;
    buscarGrupos.onclick = queryGrupos;
    agregarGrupos.onclick = () => prepareGrupo(null, null);
    importarGrupos.onclick = importGrupos;

    slDia.addEventListener('change', () => {

        let dia = slDia.options[slDia.selectedIndex].value;

        if (dia === 'TS') {

            slHoraInicio.value = '0700';
            slHoraFin.value = '2200';

            slHoraInicio.disabled = true;
            slHoraFin.disabled = true;

        } else {

            slHoraInicio.disabled = false;
            slHoraFin.disabled = false;
        }
    });

    // setTimeout(() => {
    //     queryGrupos();
    // }, 100);

    // Llamar a queryGrupos al cargar la página
    queryGrupos(); // Aquí es donde se agrega la llamada
};



const fillSemestres = async (item, hasAll) => {
    item.innerHTML = "";

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



window.addEventListener("load", init, true);

/// PREPARA EL MODAL PARA AGREGAR/EDITAR UN GRUPO
const prepareGrupo = (Id, grupo) => {
    const tieneId = (Id && Id > 0);
    const modalGrupo = document.getElementById("ModalGrupo");
    if (modalGrupo) {
        modalGrupo.open = true;
        modalGrupo.querySelector("[slot='title']").innerText = tieneId ? "EDITAR" : "AGREGAR";
        const mid = document.getElementById("mgaid");
        const minscritos = document.getElementById("minscritos");
        const materia = document.getElementById("mgmmateria");
        const nombre = document.getElementById("mgmnombre");
        const aula = document.getElementById("mgmaula");
        const dia = document.getElementById("mgmdia");
        const horainicio = document.getElementById("mgmhorainicio");
        const horafin = document.getElementById("mgmhorafin");
        const capacidad = document.getElementById("mgmcapacidad");
        const sesiones = document.getElementById("mgmsesiones");
        const encargadogrupo = document.getElementById("mgmmaestro");

        if (mid && minscritos && materia && nombre && dia && horainicio && horafin && capacidad && sesiones && grupo && aula) {
            mid.value = Id;
            minscritos.value = grupo.Inscritos.split("/")[0];
            materia.value = grupo.MateriaId;
            materia.setAttribute("disabled", true);
            nombre.value = grupo.Nombre;
            aula.value = grupo.Aula;
            dia.value = grupo.Dia;
            horainicio.value = grupo.HoraInicio;
            horafin.value = grupo.HoraFin;
            capacidad.value = grupo.Limite;
            sesiones.value = grupo.Sesiones;
            encargadogrupo.value = grupo.MaestroId;
        }
        else {
            materia.removeAttribute("disabled");
        }
        modalGrupo.onClose = () => {
            mid.value = "";
            minscritos.value = "";
            materia.value = "";
            nombre.value = "";
            dia.value = "";
            horainicio.value = "";
            horafin.value = "";
            capacidad.value = "0";
            sesiones.value = "0";
            encargadogrupo.value = "0";
        }
    }
}

/// ELIMINA UN GRUPO
const deleteGrupo = async (id) => {
    const res = await showYesNoMessage("Grupos", "ELIMINAR", "¿Esta seguro de querer eliminar el registro?", "sm");
    if (res) {
        const modal = createModal("Grupos", "ELIMINANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("gruposcontroller.php",
            {
                type: "Delete",
                ...{
                    id
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Grupos", "Error", response.data, true);
        }
        else {
            await showMessage("Grupos", "ELIMINAR", response.data, true);
            await queryGrupos();
        }
    }
}

/// EJECUTA LA BUSQUEDA DE GRUPOS
const queryGrupos = async () => {
    const resultadoGrupos = document.getElementById("ResultadoGrupos");
    let materia = document.getElementById("mgmateria");
    let nombre = document.getElementById("mgnombre");
    let dia = document.getElementById("mgdia");
    let horainicio = document.getElementById("mghorainicio");
    let horafin = document.getElementById("mghorafin");
    let semestre = document.getElementById("mgmsemestre");

    if (resultadoGrupos && materia && nombre && dia && horainicio && horafin) {
        materia = materia.value.trim();
        nombre = nombre.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        semestre = semestre.value.trim();
        const modal = createModal("Grupos", "BUSCANDO...", "Espere...", "sm", false);
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
                    semestre
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Grupos", "Error", response.data, true);
        }
        else {
            resultadoGrupos.innerHTML = "";
            if (response.data.length > 0) {
                response.data.forEach(x => {
                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");
                    const deleteBtn = document.createElement("span");
                    deleteBtn.className = "icon-delete_outline";
                    deleteBtn.setAttribute("title", "Eliminar");
                    const editBtn = document.createElement("span");
                    editBtn.className = "icon-create";
                    editBtn.setAttribute("title", "Editar");
                    const asistenciasBtn = document.createElement("span");
                    asistenciasBtn.className = "icon-supervised_user_circle";
                    asistenciasBtn.setAttribute("title", "Asistencias/Puntos");
                    tdeditar.appendChild(deleteBtn);
                    tdeditar.appendChild(editBtn);
                    tdeditar.appendChild(asistenciasBtn);
                    const tdmateria = document.createElement("td");
                    tdmateria.innerText = x.Materia;
                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = x.Nombre;
                    const tdaula = document.createElement("td");
                    tdaula.innerText = x.Aula;
                    const tdSemestre = document.createElement("td");
                    tdSemestre.innerText = x.Semestre;
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
                    const tdlimite = document.createElement("td");
                    tdlimite.innerText = x.Limite;
                    const tdsesiones = document.createElement("td");
                    tdsesiones.innerText = x.Sesiones;
                    const tdinscritos = document.createElement("td");
                    tdinscritos.innerText = x.Inscritos;
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdmateria);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdaula);
                    tr.appendChild(tdSemestre);
                    tr.appendChild(tddia);
                    tr.appendChild(tdhorainicio);
                    tr.appendChild(tdhorafin);
                    tr.appendChild(tdlimite);
                    tr.appendChild(tdsesiones);
                    tr.appendChild(tdinscritos);
                    resultadoGrupos.appendChild(tr);
                    deleteBtn.onclick = () => deleteGrupo(x.Id);
                    editBtn.onclick = () => prepareGrupo(x.Id, x);
                    asistenciasBtn.onclick = () => prepareGrupoAsistencias(x.Id, x);
                });
            }
        }
    }
}

/// AGREGA/EDITA UN GRUPO
const addEditGrupo = async () => {
    let id = document.getElementById("mgaid");
    let minscritos = document.getElementById("minscritos");
    let materia = document.getElementById("mgmmateria");
    let nombre = document.getElementById("mgmnombre");
    let aula = document.getElementById("mgmaula");
    let dia = document.getElementById("mgmdia");
    let horainicio = document.getElementById("mgmhorainicio");
    let horafin = document.getElementById("mgmhorafin");
    let capacidad = document.getElementById("mgmcapacidad");
    let sesiones = document.getElementById("mgmsesiones");
    let encargado = mmaestro.selectedIndex > 0 ? parseInt(mmaestro.options[mmaestro.selectedIndex].value) : 0;

    const modalGrupo = document.getElementById("ModalGrupo");

    if (id && minscritos && materia && aula && dia && horainicio && horafin && capacidad && sesiones && modalGrupo) {
        id = id.value.trim();
        minscritos = minscritos.value.trim();
        materia = materia.value.trim();
        aula = aula.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        capacidad = parseInt(capacidad.value.trim());
        sesiones = parseInt(sesiones.value.trim());
        const tieneId = (id.length > 0);
        let msgError = [];
        if (
            materia.length <= 0 ||
            aula.length <= 0 ||
            dia.length <= 0 ||
            horainicio.length <= 0 ||
            horafin.length <= 0 ||
            capacidad.length <= 0 ||
            sesiones.length <= 0
        ) {
            msgError.push("Todos los campos son requeridos");
        }
        if (horainicio == horafin) {
            msgError.push("La hora de inicio no puede ser igual a la de fin");
        }
        if (capacidad < minscritos) {
            msgError.push("La capacidad no puede ser menor que 0 o menor que el número de alumnos ya inscritos al grupo");
        }
        if (sesiones <= 0) {
            msgError.push("La cantidad de sesiones no puede ser menor que 0");
        }
        if (msgError.length > 0) {
            await showMessage("Grupos", "Error", msgError, true);
            return;
        }
        const modal = createModal("Grupos", "GUARDANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("gruposcontroller.php",
            {
                type: tieneId ? "Edit" : "Add",
                ...{
                    id,
                    materia,
                    aula,
                    dia,
                    horainicio,
                    horafin,
                    capacidad,
                    sesiones,
                    encargado
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Grupos", "Error", response.data, true);
        }
        else {
            const semestres = document.getElementById('mgmsemestre')
            fillSemestres(semestres, false);
            await showMessage("Grupos", "GUARDAR", response.data, true);
            await queryGrupos();
        }
        modalGrupo.open = false;
    }
}

const importGrupos = async () => {
    const res = await showYesNoMessage("Grupos", "IMPORTACIÓN", [
        "Para importar es necesario que el archivo contenga el siguiente formato:",
        `
      <br><table>
              <tbody>
                  <tr>
                      <td>Nombre de la materia</td>
                      <td style="text-align: center;">Dia (Lunes, Martes, etc.)</td>
                      <td style="text-align: center;">Hora inicio (formato 24hrs, eje: 08:00)</td>
                      <td style="text-align: center;">Hora fin (formato 24hrs, eje: 14:00)</td>
                      <td style="text-align: center;">limite</td>
                  </tr>
              </tbody>
          </table>
      `,
        "<br><center>¿Cumple con los requisitos?</center>"
    ], "lg");

    if (!res) return;
    const file = await loadFile(false, ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel");
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, {
                type: 'binary'
            });
            if (workbook.SheetNames.length > 0) {
                const sheetName = workbook.SheetNames[0];
                const XLObjects = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                let grupos = [];
                for (let i = 0; i < XLObjects.length; i++) {
                    const objValues = Object.values(XLObjects[i]);
                    if (objValues.length != 5 && objValues.length != 6) {
                        await showMessage("Grupos", "Error", "El número de campos no concuerda con los pedidos", true);
                        return;
                    }
                    grupos.push(objValues);
                }

                console.log(grupos)
                const modal = createModal("Grupos", "IMPORTANDO...", "Espere...", "sm", false);
                modal.open = true;
                const response = await makeRequest("gruposcontroller.php",
                    {
                        type: "Import",
                        ...{
                            grupos,
                        }
                    });
                modal.open = false;
                setTimeout(() => {
                    modal.remove();
                }, 10);
                if (response.error) {
                    await showMessage("Grupos", "IMPORTAR", response.data, true, "lg");
                }
                else {
                    await showMessage("Grupos", "IMPORTAR", response.data, true);
                }
                const buscarMaterias = document.getElementById("BuscarMaterias");
                if (buscarMaterias) {
                    setTimeout(() => {
                        queryGrupos();
                        buscarMaterias.click();
                    }, 100);
                }
            }
            else {
                await showMessage("Grupos", "Error", "El libro no cuenta con hojas", true);
            }
        };
        reader.onerror = async (ex) => {
            await showMessage("Grupos", "Error", "Error al leer archivo", true);
        };
        reader.readAsBinaryString(file);
    }
}

const prepareGrupoAsistencias = async (Id, grupo) => {

    const modalGrupoAsistencias = document.getElementById("ModalGrupoAsistencias");
    const modal = createModal("Grupos", "CARGANDO...", "Espere...", "sm", false);

    modalGrupoAsistencias.open = true;
    if(grupo.Encargado == null){
        grupo.Encargado = "";
    }
    modalGrupoAsistencias.querySelector("[slot='title']").innerText = `ASISTENCIAS - ${grupo.Nombre} - ${grupo.Materia} - ${grupo.Encargado}`;

    modal.open = true;

    modalGrupoAsistencias.onClose = () => {
        document.getElementById("ResultadoSesiones").innerHTML = '';
    }

    await querySesiones(Id, grupo.sesiones);

    modal.open = false;
    setTimeout(() => {
        modal.remove();
    }, 10);
};

const querySesiones = async (grupoId, cantidadSesiones) => {
    const resultadoSesiones = document.getElementById("ResultadoSesiones");
    const response = await makeRequest("gruposcontroller.php",
        {
            type: "QuerySesiones",
            ...{
                grupoId
            }
        });
    if (response.error) {
        await showMessage("Grupos", "Error", response.data, true);
    }
    else {
        resultadoSesiones.innerHTML = "";
        if (response.data.length > 0) {

            var sesiones = response.data;
            var alumnos = sesiones.map(item => item.NombreCompleto).filter((value, index, self) => self.indexOf(value) === index);
            alumnos = alumnos.sort();
            // var alumnos = [...new Map(sesiones.map(item => [item['UsuarioId'], item])).values()];

            alumnos.forEach(x => {

                // sesiones por alumno
                var sesionesAlumno = sesiones.filter(item => item.NombreCompleto === x);

                const tr = document.createElement("tr");

                // matricula
                const tdmatricula = document.createElement("td");
                tdmatricula.innerText = sesionesAlumno[0].Matricula;
                tr.appendChild(tdmatricula);

                // alumno
                const tdnombre = document.createElement("td");
                tdnombre.innerText = x;
                tr.appendChild(tdnombre);
                
                // correo
                const tdcorreo = document.createElement("td");
                tdcorreo.innerText = sesionesAlumno[0].Correo;
                tr.appendChild(tdcorreo);

                sesionesAlumno.forEach(s => {

                    const tdsesion = document.createElement("td");
                    const inCalificacion = document.createElement("input");
                    
                    inCalificacion.setAttribute("type", "text");
                    inCalificacion.setAttribute("inputmode", "numeric");
                    inCalificacion.setAttribute("max", "100");
                    inCalificacion.setAttribute("min", "0");
                    inCalificacion.setAttribute("className", "Number");
                    inputFilter(inCalificacion, value => /^\d*$/.test(value));
                    inCalificacion.value = s.Asistio;
                    inCalificacion.onchange = () => cambiarCalificacion(inCalificacion.value, s);
                    
                    tdsesion.appendChild(inCalificacion);
                    tr.appendChild(tdsesion);
                    
                });

                resultadoSesiones.appendChild(tr);
            });
        } else {
            resultadoSesiones.innerHTML = `
                  <tr>
                      <td colspan="1000">
                          No existen sesiones de alumnos para este grupo
                      </td>
                  </tr>
              `;
        }
    }
}

const getCalificacionValue = (index) => {
    switch (index) {
        default:
            return -1;

        case -1: {
            return -1;
        }

        case 0: {
            return 0;
        }

        case 1: {
            return 0.5;
        }

        case 2: {
            return 1;
        }
    }
};

const getCalificacionText = (index) => {
    switch (index) {
        default:
            return "...";

        case -1: {
            return "...";
        }

        case 0: {
            return "0";
        }

        case 1: {
            return "0.5";
        }

        case 2: {
            return "1";
        }
    }
};

const cambiarCalificacion = async (select, sesion) => {

    var calificacion = parseFloat(select);

    if (calificacion < 0 || calificacion > 100) {
        alert("Seleccione una calificación valida");
        return;
    }

    sesion.Asistio = calificacion;

    const modal = createModal("Grupos", "CALIFICANDO...", "Espere...", "sm", false);
    modal.open = true;

    const response = await makeRequest("gruposcontroller.php",
        {
            type: "Calificar",
            sesion
        });

    modal.open = false;

    setTimeout(() => {
        modal.remove();
    }, 10);

    if (response.error) {
        await showMessage("Grupos", "Error", response.data, true);
    } else {
        console.log("calificado");
    }
};