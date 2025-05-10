import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal } from "./utility.js";


const carrera = document.getElementById('carrera')


// load
const init = () => {

    fillCarrera(carrera, false)

}

// Llama a la funcion init al momento de cargar la pagina completamente
window.addEventListener('load', init, true)

const fillCarrera = async (item, hasAll) => {
    const nombre = '';
    const response = await makeRequest('materiascontroller.php', {
        type: 'GetCarreras'
    });

    if (response.data.length > 0) {
        let html = hasAll ? "<option value='T' selected>TODAS</option>" : '';
        response.data.forEach(
            x => (html += `<option value='${x.Id}'>${x.Nombre}</option>`)
        );
        item.innerHTML = html;
    }
};





/// PREPARA EL MODAL PARA AGREGAR/EDITAR UN MATERIA
const prepareMateria = (Id, materia) => {
    const tieneId = (Id && Id > 0);
    const modalMateria = document.getElementById("ModalMateria");
    if (modalMateria) {
        modalMateria.open = true;
        modalMateria.querySelector("[slot='title']").innerText = tieneId ? "EDITAR" : "AGREGAR";
        const mid = document.getElementById("maid");
        const nombre = document.getElementById("mmanombre");
        if (mid && nombre && materia) {
            mid.value = Id;
            nombre.value = materia.Nombre;
            // nombre.setAttribute("disabled", true);
        }
        else {
            nombre.removeAttribute("disabled");
        }
        modalMateria.onClose = () => {
            mid.value = "";
            nombre.value = "";
        }
    }
}
/// ELIMINA UN MATERIA
const deleteMateria = async (id) => {
    const res = await showYesNoMessage("Materias", "ELIMINAR", "¿Esta seguro de querer eliminar el registro?", "sm");
    if (res) {
        const modal = createModal("Materias", "ELIMINANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("materiascontroller.php",
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
            await showMessage("Materias", "Error", response.data, true);
        }
        else {
            await showMessage("Materias", "ELIMINAR", response.data, true);
            await queryMaterias();
        }
    }
}

const reactivarMateria = async (id) => {
    const res = await showYesNoMessage("Materias", "REACTIVAR", "¿Esta seguro de querer reactivar la materia?", "sm");
    if (res) {
        const modal = createModal("Materias", "Reactivando...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("materiascontroller.php",
            {
                type: "Reactivar",
                ...{
                    id
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Materias", "Error", response.data, true);
        }
        else {
            await showMessage("Materias", "REACTIVAR", response.data, true);
            await queryMaterias();
        }
    }
}

/// EJECUTA LA BUSQUEDA DE MATERIAS
const queryMaterias = async () => {
    const resultadoMaterias = document.getElementById("ResultadoMaterias");
    let nombre = document.getElementById("manombre");
    let estatusSelect = document.getElementById('estatusC')
    let estatusValue = estatusSelect.value;
    // Obtener el ID de la carrera seleccionada
    let carreraSelect = document.getElementById("carrera");
    let carreraId = carreraSelect.value;

    if (resultadoMaterias && nombre && estatusValue && carreraId) {
        nombre = nombre.value.trim();
        const modal = createModal("Materias", "BUSCANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("materiascontroller.php",
            {
                type: "QueryC",
                ...{
                    nombre,
                    carreraId,
                    estatusValue,
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Materias", "Error", response.data, true);
        }
        else {
            resultadoMaterias.innerHTML = "";
            if (response.data.length > 0) {
                response.data.forEach(x => {
                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");
                    const deleteBtn = document.createElement("span");

                    if (estatusValue == 1) {
                        deleteBtn.className = "icon-delete_outline";
                        deleteBtn.setAttribute("title", "Eliminar");
                        tdeditar.appendChild(deleteBtn);
                        deleteBtn.onclick = () => deleteMateria(x.Id);
                    }
                    else {
                        deleteBtn.className = "icon-history";
                        deleteBtn.setAttribute("title", "Reactivar");
                        tdeditar.appendChild(deleteBtn);
                        deleteBtn.onclick = () => reactivarMateria(x.Id);
                    }
                    const editBtn = document.createElement("span");
                    editBtn.className = "icon-create";
                    editBtn.setAttribute("title", "Editar");
                    tdeditar.appendChild(editBtn);
                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = `${x.Nombre}`;
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdnombre);
                    resultadoMaterias.appendChild(tr);
                    editBtn.onclick = () => prepareMateria(x.Id, x);
                });
            }
        }
    }
}
/// AGREGA/EDITA UN MATERIA
const addEditMateria = async () => {
    let id = document.getElementById("maid");
    let nombre = document.getElementById("mmanombre");
    const modalMateria = document.getElementById("ModalMateria");
    if (id && nombre && modalMateria) {
        id = id.value.trim();
        nombre = nombre.value.trim().toUpperCase();
        const tieneId = (id.length > 0);
        let msgError = [];
        if (nombre.length <= 0) {
            msgError.push("El materia debe contar con nombre");
        }
        if (msgError.length > 0) {
            await showMessage("Materias", "Error", msgError, true);
            return;
        }
        const modal = createModal("Materias", "GUARDANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("materiascontroller.php",
            {
                type: tieneId ? "Edit" : "Add",
                ...{
                    id,
                    nombre,
                }
            });
        modal.open = false;
        setTimeout(() => {
            modal.remove();
        }, 10);
        if (response.error) {
            await showMessage("Materias", "Error", response.data, true);
        }
        else {
            await showMessage("Materias", "GUARDAR", response.data, true);
            await queryMaterias();
        }
        modalMateria.open = false;
    }
}
const materiaGuardar = document.getElementById("MateriaGuardar");
if (materiaGuardar) {
    materiaGuardar.onclick = addEditMateria;
}
const buscarMaterias = document.getElementById("BuscarMaterias");
if (buscarMaterias) {
    setTimeout(() => {
        queryMaterias();
    }, 100);
    buscarMaterias.onclick = queryMaterias;
}
const agregarMaterias = document.getElementById("AgregarMaterias");
if (agregarMaterias) {
    agregarMaterias.onclick = () => prepareMateria(null, null);
}