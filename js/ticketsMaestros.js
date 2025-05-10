import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile, showFormatMessage } from "../utility.js";


document.getElementById("CrearTicket").addEventListener("click", function () {
    window.location.href = "tickets";
});

/// EJECUTA LA BUSQUEDA DE ALUMNOS
const queryTickets = async () => {
    const resultadoTickets = document.getElementById("ResultadoTickets");
    // let matricula = document.getElementById("matricula");
    // let nombre = document.getElementById("nombre");
    // let primerap = document.getElementById("primerap");
    // let segundoap = document.getElementById("segundoap");
    // let perfil = document.getElementById("perfil");
    // if (resultadoTickets && matricula && nombre && primerap && segundoap) {
    //     matricula = matricula.value.trim();
    //     nombre = nombre.value.trim();
    //     primerap = primerap.value.trim();
    //     segundoap = segundoap.value.trim();
    //     perfil = perfil.value.trim();
    const modal = createModal("Tickets", "BUSCANDO...", "Espere...", "sm", false);
    modal.open = true;
    const response = await makeRequest("controllers/ticketsController.php",
        {
            type: "QueryMaestro",
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
            response.data.forEach(x => {
                if (x.Estado == "CERRADO") {
                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");

                    const rechazarBtn = document.createElement("span");
                    rechazarBtn.className = "icon-cancel";
                    rechazarBtn.setAttribute("title", "Rechazar");
                    // const procesarBtn = document.createElement("span");
                    // procesarBtn.className = "icon-access_time";
                    // procesarBtn.setAttribute("title", "Empezar proceso");
                    const aprobarBtn = document.createElement("span");
                    aprobarBtn.className = "icon-check";
                    aprobarBtn.setAttribute("title", "Aceptar y cerrar");
                    tdeditar.appendChild(rechazarBtn);
                    // tdeditar.appendChild(procesarBtn);
                    tdeditar.appendChild(aprobarBtn);
                    const tdIdTicket = document.createElement("td");
                    tdIdTicket.innerText = x.Id;
                    const tdmatricula = document.createElement("td");
                    tdmatricula.innerText = x.Aula;
                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = x.Equipo;
                    const tdcorreo = document.createElement("td");
                    tdcorreo.innerText = x.Descripcion;
                    const tdEstado = document.createElement("td");
                    tdEstado.innerText = x.Estado;
                    // const tdCreador = document.createElement("td");
                    // tdCreador.innerText = x.Creador;
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdIdTicket);
                    tr.appendChild(tdmatricula);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdcorreo);
                    tr.appendChild(tdEstado);
                    // tr.appendChild(tdCreador);
                    resultadoTickets.appendChild(tr);
                    rechazarBtn.onclick = () => rechazarTicket(x.Id);
                    // procesarBtn.onclick = () => procesarTicket(x.Id);
                    aprobarBtn.onclick = () => aprobarTicket(x.Id);
                    // editBtn.onclick = () => prepareAlumno(x.Id, x);
                    // passBtn.onclick = () => restaurarContraseñaAlumno(x.Id, x.Matricula);
                } else {
                    const tr = document.createElement("tr");
                    const tdeditar = document.createElement("td");

                    // const rechazarBtn = document.createElement("span");
                    // rechazarBtn.className = "icon-cancel";
                    // rechazarBtn.setAttribute("title", "Rechazar");
                    // const procesarBtn = document.createElement("span");
                    // procesarBtn.className = "icon-access_time";
                    // procesarBtn.setAttribute("title", "Empezar proceso");
                    // const aprobarBtn = document.createElement("span");
                    // aprobarBtn.className = "icon-check";
                    // aprobarBtn.setAttribute("title", "Aceptar y cerrar");
                    // tdeditar.appendChild(rechazarBtn);
                    // tdeditar.appendChild(procesarBtn);
                    // tdeditar.appendChild(aprobarBtn);
                    const tdIdTicket = document.createElement("td");
                    tdIdTicket.innerText = x.Id;
                    const tdmatricula = document.createElement("td");
                    tdmatricula.innerText = x.Aula;
                    const tdnombre = document.createElement("td");
                    tdnombre.innerText = x.Equipo;
                    const tdcorreo = document.createElement("td");
                    tdcorreo.innerText = x.Descripcion;
                    const tdEstado = document.createElement("td");
                    tdEstado.innerText = x.Estado;
                    // const tdCreador = document.createElement("td");
                    // tdCreador.innerText = x.Creador;
                    tr.appendChild(tdeditar);
                    tr.appendChild(tdIdTicket);
                    tr.appendChild(tdmatricula);
                    tr.appendChild(tdnombre);
                    tr.appendChild(tdcorreo);
                    tr.appendChild(tdEstado);
                    // tr.appendChild(tdCreador);
                    resultadoTickets.appendChild(tr);
                    // rechazarBtn.onclick = () => rechazarTicket(x.Id);
                    // procesarBtn.onclick = () => procesarTicket(x.Id);
                    // aprobarBtn.onclick = () => aprobarTicket(x.Id);
                    // editBtn.onclick = () => prepareAlumno(x.Id, x);
                    // passBtn.onclick = () => restaurarContraseñaAlumno(x.Id, x.Matricula);
                }
            });
        }
    }
    // }
}

queryTickets();


/// RECHAZA UN TICKET
// const rechazarTicket = async (id) => {
//     const res = await showYesNoMessage("Tickets", "RECHAZAR", "¿Está seguro de querer rechazar el cierre del ticket?", "sm");
//     if (res) {
//         const modal = createModal("Tickets", "RECHAZANDO...", "Espere...", "sm", false);
//         modal.open = true;
//         const response = await makeRequest("controllers/ticketsController.php",
//             {
//                 type: "Rechazar",
//                 ...{
//                     id
//                 }
//             });
//         modal.open = false;
//         setTimeout(() => {
//             modal.remove();
//         }, 10);
//         if (response.error) {
//             await showMessage("Tickets", "Error", response.data, true);
//         }
//         else {
//             await showMessage("Tickets", "RECHAZAR", response.data, true);
//             await queryTickets();
//         }
//     }
// }

const rechazarTicket = async (id) => {
    const { value: motivo } = await Swal.fire({
        title: 'Ingresar motivo de rechazo',
        input: 'text',
        inputLabel: 'Ingrese su motivo:',
        showCancelButton: true,
        confirmButtonText: 'Rechazar',
        allowOutsideClick: false,
        confirmButtonColor: '#006064',
        cancelButtonText: 'Cancelar',
        inputAttributes: {
            maxlength: 100 // Establece la longitud máxima del input
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Debe ingresar un motivo para rechazar';
            }
        }
    });

    // Restablecer la clase del elemento body
    document.body.className = '';


    if (motivo) {
        //   console.log('Texto ingresado:', motivo);
        // Aquí puedes hacer lo que necesites con el texto ingresado
        const modal = createModal("Tickets", "RECHAZANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("controllers/ticketsController.php",
            {
                type: "Rechazar",
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
        }
        else {
            await showMessage("Tickets", "RECHAZAR", response.data, true);
            await queryTickets();
        }

    }
};

/// APRUEBA UN TICKET
const aprobarTicket = async (id) => {
    const res = await showYesNoMessage("Tickets", "APROBAR", "¿Está seguro de querer aprobar el cierre del ticket?", "sm");
    if (res) {
        const modal = createModal("Tickets", "APROBANDO...", "Espere...", "sm", false);
        modal.open = true;
        const response = await makeRequest("controllers/ticketsController.php",
            {
                type: "Aprobar",
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
            await showMessage("Tickets", "APROBAR", response.data, true);
            await queryTickets();
        }
    }
}
