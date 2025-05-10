import { fillMaterias } from "./main.js";
import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal } from "./utility.js";

initializeApp();


document.addEventListener("DOMContentLoaded", function() {
    init();
});


const init = () => {
    const semestres = document.getElementById('mgSemestreMaestros')
    fillSemestres(semestres, false);

    const semestreInscripciones = document.getElementById('mgSemestreMaestrosInscripcion')
    fillSemestres(semestreInscripciones, false);

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



//GRUPOS DE MATERIAS
const slGruposMaterias = document.getElementById('slGruposMateria');
const slMaterias2 = document.getElementById('agmateria');
const slSemestres = document.getElementById('mgSemestreMaestrosInscripcion');
const slDia = document.getElementById('mgdia');
const slDia2 = document.getElementById('agdia');
const slHoraInicio = document.getElementById('mghorainicio');
const slHoraFin = document.getElementById('mghorafin');
const slHoraInicio2 = document.getElementById('aghorainicio');
const slHoraFin2 = document.getElementById('aghorafin');

// BTN FILTRAR ALUMNO 
const btnFiltrarAlumno = document.getElementById('btnFiltrarAlumno');
const mdlBuscarAlumno = document.getElementById('mdlBuscarAlumno');

window.onload = () => {
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

    slMaterias2.addEventListener('change', () => {

        let idMateria = slMaterias2.options[slMaterias2.selectedIndex].value;
        slGruposMaterias.disabled = idMateria == null || idMateria === undefined || idMateria === 'T' || idMateria <= 0;

        slGruposMaterias.innerHTML = "";

        idMateria = idMateria === 'T' ? 0 : parseInt(idMateria);

        if (!slGruposMaterias.disabled) {
            fillGruposMaterias(idMateria);
        } else {
            slGruposMaterias.innerHTML = `<option value="0">Seleccione una materia</option>"`;
        }
    });


    slSemestres.addEventListener("change", function() {
        let idMateria = slMaterias2.options[slMaterias2.selectedIndex].value;
        slGruposMaterias.disabled = idMateria == null || idMateria === undefined || idMateria === 'T' || idMateria <= 0;

        slGruposMaterias.innerHTML = "";

        idMateria = idMateria === 'T' ? 0 : parseInt(idMateria);

        if (!slGruposMaterias.disabled) {
            fillGruposMaterias(idMateria);
        } else {
            slGruposMaterias.innerHTML = `<option value="0">Seleccione una materia</option>"`;
        }
    });
    
    

    btnFiltrarAlumno.addEventListener('click', () => {
        mdlBuscarAlumno.open = true;
    });


}


/* AQUI SE LLENAN LOS COMBOS */

const mmat = document.getElementById("mgmmateria");
if (mmat) {
    fillMateria(mmat, false);
}
const mat = document.getElementById("mgmateria");
if (mat) {
    fillMateria(mat, true);
}
const matAlumnosGrupo = document.getElementById("agmateria");
if (matAlumnosGrupo) {
    fillMateria(matAlumnosGrupo, true);
}

const logout = async () => {
    const res = await makeRequest("logout.php", {});
    if (res.error) {
        showMessage("wrapper", "Error", res.data, true);
    }
    else {
        showMessage("wrapper", "Redirigiendo", "Cerrando sesión...", false);
        setTimeout(() => {
            window.location.replace("index.php");
        }, 1000);
    }
}

// MODIFICAR DATOS
const menu = document.getElementById("menu");
if (menu) {
    menu.onMenuClick = item => {
        switch (item) {
            case "logout":
                logout();
                break;
        }
    }
}

const perfil = document.getElementById("perfil");
if (perfil) {
    perfil.addEventListener("click", () => {
        const miPerfil = document.getElementById("MiPerfil");
        if (miPerfil) {
            miPerfil.open = true;
        }
    });
}

function validateEmail(correo) {
    const formatoActual = /^[a-zA-Z0-9_\.+]+(\.)+[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/;
    const formatoAntiguo = /^[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/;

    return formatoActual.test(correo) || formatoAntiguo.test(correo);
}

const changeCorreo = async () => {
    let response = null;
    let correo = document.getElementById("correo");

    if (correo) {
        correo = correo.value.trim();
        if (correo.length <= 0) {
            await showMessage("wrapper", "Error", "El campo del correo no debe estar vacío", true, "sm");
            return;
        } else if (validateEmail(correo) == false) {
            await showMessage("wrapper", "Error", "El correo ingresado NO es válido, intente de nuevo", true, "sm");
            return;
        } else {
            const modal = createModal("wrapper", "GUARDANDO CORREO...", "Espere...", "sm", false);
            modal.open = true;
            response = await makeRequest("alumnoscontroller.php", {
                type: "ChangeEmail",
                ...{
                    correo,
                }
            });
            modal.open = false;
            setTimeout(() => {
                modal.remove();
            }, 10);
            if (response && response.error) {
                await showMessage("wrapper", "Error", response.data, true);
            }
            else {
                // await showMessage("wrapper", "GUARDANDO CORREO", response.data, true);
                location.reload();
            }
        }
        modal.open = false;
    }
}
const changeContraseña = async () => {
    let contraseña = document.getElementById("contraseña");
    if (contraseña) {
        contraseña = contraseña.value.trim();
        if (contraseña.length <= 0) {
            await showMessage("wrapper", "Error", "El campo del contraseña no debe estar vacío", true, "sm");
            return;
        }
        const modal = createModal("wrapper", "GUARDANDO CONTRASEÑA...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("alumnoscontroller.php",
            {
                type: "ChangePassword",
                ...{
                    contraseña,
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("wrapper", "Error", response.data, true);
        }
        else {
            await showMessage("wrapper", "GUARDANDO CONTRASEÑA", response.data, true);
            document.getElementById("contraseña").value = "";
        }
    }
}

const guardarMiCorreo = document.getElementById("GuardarMiCorreo");
if (guardarMiCorreo) {
    guardarMiCorreo.addEventListener("click", () => {
        changeCorreo();
    });
}
const guardarMiContraseña = document.getElementById("GuardarMiContraseña");
if (guardarMiContraseña) {
    guardarMiContraseña.addEventListener("click", () => {
        changeContraseña();
    });
}

/// EJECUTA LA BUSQUEDA DE GRUPOS
const queryGrupos = async () => {
    const resultadoGrupos = document.getElementById("ResultadoGrupos");
    let materia = document.getElementById("mgmateria");
    let nombre = document.getElementById("mgnombre");
    let dia = document.getElementById("mgdia");
    let horainicio = document.getElementById("mghorainicio");
    let horafin = document.getElementById("mghorafin");
    let idMaestro = document.getElementById("ProfesorId");
    let semestre = document.getElementById('mgSemestreMaestros')

    if (resultadoGrupos && materia && nombre && dia && horainicio && horafin && idMaestro) {
        materia = materia.value.trim();
        nombre = nombre.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        idMaestro = parseInt(idMaestro.value);
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
                    idMaestro,
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
                    // tdeditar.appendChild(deleteBtn);
                    // tdeditar.appendChild(editBtn);
                    tdeditar.appendChild(asistenciasBtn);
                    const tdmateria = document.createElement("td");
                    tdmateria.innerText = x.Materia;
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
                    const tdlimite = document.createElement("td");
                    tdlimite.innerText = x.Limite;
                    const tdsesiones = document.createElement("td");
                    tdsesiones.innerText = x.Sesiones;
                    const tdinscritos = document.createElement("td");
                    tdinscritos.innerText = x.Inscritos;
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdmateria);
                    tr.appendChild(tdnombre);
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
/// EJECUTA LA BUSQUEDA DE GRUPOS POR ALUMNO
const queryGruposPorAlumno = async () => {
    const resultadoGrupos = document.getElementById("ResultadoAlumnoGrupos");
    let materia = document.getElementById("agmateria");
    let nombre = document.getElementById("agnombre");
    let dia = document.getElementById("agdia");
    let horainicio = document.getElementById("aghorainicio");
    let horafin = document.getElementById("aghorafin");
    let matricula = document.getElementById("mgalumno");
    let grupo = document.getElementById('slGruposMateria');
    let idMaestro = document.getElementById("ProfesorId");
    let semestre = document.getElementById('mgSemestreMaestrosInscripcion')


    if (resultadoGrupos && materia && nombre && dia && horainicio && horafin && idMaestro) {
        materia = materia.value.trim();
        nombre = nombre.value.trim();
        dia = dia.value.trim();
        horainicio = horainicio.value.trim();
        horafin = horafin.value.trim();
        matricula = matricula.value.trim();
        grupo = grupo.value.trim();
        idMaestro = parseInt(idMaestro.value);
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
                    idMaestro,
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

                    // tr.appendChild(tdeditar);
                    tr.appendChild(tdmatricula);
                    tr.appendChild(tdalumno);
                    tr.appendChild(tdmateria);
                    tr.appendChild(tdnombre);
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

const buscarGrupos = document.getElementById("BuscarGrupos");
if (buscarGrupos) {
    setTimeout(() => {
        queryGrupos();
    }, 100);
    buscarGrupos.onclick = queryGrupos;
}

const btnBuscarGruposPorAlumno = document.getElementById("btnBuscarGruposPorAlumno");

if (btnBuscarGruposPorAlumno) {
    btnBuscarGruposPorAlumno.addEventListener("click", () => {
        queryGruposPorAlumno();
    });
}





// EJECUTA LA BUSQUEDA DE GRUPOS DE UNA MATERIA 
const fillGruposMaterias = async (idMateria) => {

    let semestre = document.getElementById("mgSemestreMaestrosInscripcion").value.trim();

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
        slGruposMaterias.innerHTML = html;
    } else {
        slGruposMaterias.innerHTML = `<option value="0">No cuenta con grupos</option>"`;
    }
};

/// EJECUTA LA BUSQUEDA DE ALUMNO ESPECIFICO
const queryBuscarAlumno = async () => {

    const resultadoAlumnos = document.getElementById("ResultadoBuscarAlumno");
    let matricula = document.getElementById("mgBuscarMatricula");
    let nombre = document.getElementById("mgBuscarNombre");
    let primerap = document.getElementById("mgBuscarApPaterno");
    let segundoap = document.getElementById("mgBuscarApMaterno");
    let perfil = '4';

    btnBuscarAlumno.disabled = true;

    if (resultadoAlumnos && matricula && nombre && primerap && segundoap) {

        matricula = matricula.value.trim();
        nombre = nombre.value.trim();
        primerap = primerap.value.trim();
        segundoap = segundoap.value.trim();

        const response = await makeRequest("alumnoscontroller.php",
            {
                type: "Query",
                ...{
                    matricula,
                    nombre,
                    primerap,
                    segundoap,
                    perfil,
                }
            });

        if (response.error) {
            btnBuscarAlumno.disabled = false;
            await showMessage("Alumnos", "Error", response.data, true);
        }
        else {
            resultadoAlumnos.innerHTML = "";
            if (response.data.length > 0) {

                response.data.forEach(x => {

                    // fila
                    const tr = document.createElement("tr");

                    // col matricula
                    const tdmatricula = document.createElement("td");
                    tdmatricula.innerText = x.Matricula;

                    // col nombre
                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = `${x.Nombre} ${x.ApPaterno} ${x.ApMaterno}`;

                    // col correo
                    const tdcorreo = document.createElement("td");
                    tdcorreo.innerText = x.Correo;

                    tr.appendChild(tdmatricula);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdcorreo);

                    tr.onclick = () => selectAlumno(x);

                    resultadoAlumnos.appendChild(tr);
                });

                btnBuscarAlumno.disabled = false;

            } else {
                btnBuscarAlumno.disabled = false;
            }
        }
    }
}

const btnBuscarAlumno = document.getElementById("btnBuscarAlumno");
if (btnBuscarAlumno) {
    btnBuscarAlumno.onclick = queryBuscarAlumno;
}

const selectAlumno = (alumno) => {

    const mdlFiltroAlumno = document.getElementById('mdlBuscarAlumno');
    let mgalumno = document.getElementById('mgalumno');

    mgalumno.value = alumno.Matricula;

    if (mdlFiltroAlumno) {
        mdlFiltroAlumno.open = false;
    }
};


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
        const dia = document.getElementById("mgmdia");
        const horainicio = document.getElementById("mgmhorainicio");
        const horafin = document.getElementById("mgmhorafin");
        const capacidad = document.getElementById("mgmcapacidad");
        const sesiones = document.getElementById("mgmsesiones");
        const encargadogrupo = document.getElementById("mgmmaestro");

        if (mid && minscritos && materia && nombre && dia && horainicio && horafin && capacidad && sesiones && grupo) {
            mid.value = Id;
            minscritos.value = grupo.Inscritos.split("/")[0];
            materia.value = grupo.MateriaId;
            materia.setAttribute("disabled", true);
            nombre.value = grupo.Nombre;
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

//SESIONES
const prepareGrupoAsistencias = async (Id, grupo) => {

    const modalGrupoAsistencias = document.getElementById("ModalGrupoAsistencias");
    const modal = createModal("Grupos", "CARGANDO...", "Espere...", "sm", false);

    modalGrupoAsistencias.open = true;
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

//Query sesiones 
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