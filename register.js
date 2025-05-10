import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal } from "./utility.js";

initializeApp();


const menu = document.getElementById("menu");
const perfil = document.getElementById("perfil");
const guardarMiCorreo = document.getElementById("GuardarMiCorreo");
const guardarMiContraseña = document.getElementById("GuardarMiContraseña");

// tab mis grupos
const slDia1 = document.getElementById('mgdia');
const slHoraInicio1 = document.getElementById('mghorainicio');
const slHoraFin1 = document.getElementById('mghorafin');

// tab inscribirse a grupo
const slDia2 = document.getElementById('igdia');
const slHoraInicio2 = document.getElementById('ighorainicio');
const slHoraFin2 = document.getElementById('ighorafin');

const logout = async () => {
    const res = await makeRequest("logout.php", {});
    if (res.error) {
        showMessage("wrapper", "Error", res.data, true);
    }
    else {
        showMessage("wrapper", "Redirigiendo", "Cerrando sesión...", false);
        setTimeout(() => {
            window.location.replace("index");
        }, 1000);
    }
}
if (menu) {
    menu.onMenuClick = item => {
        switch (item) {
            case "logout":
                logout();
                break;
        }
    }
}

if (perfil) {
    perfil.addEventListener("click", () => {
        const miPerfil = document.getElementById("MiPerfil");
        if (miPerfil) {
            miPerfil.open = true;
        }
    });
}

// function validateEmail(correo) {
//     const formatoActual = /^[a-zA-Z0-9_\.+]+(\.)+[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/;
//     const formatoAntiguo = /^[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/;

//     return formatoActual.test(correo) || formatoAntiguo.test(correo);
// }

function validateEmail(correo) {
    const formato = /^[a-zA-Z0-9_+.-]+@uanl\.edu\.mx$/i;
    return formato.test(correo);
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
if (guardarMiCorreo) {
    guardarMiCorreo.addEventListener("click", () => {
        changeCorreo();
    });
}
if (guardarMiContraseña) {
    guardarMiContraseña.addEventListener("click", () => {
        changeContraseña();
    });
}

window.onload = () => {

    slDia1.addEventListener('click', () => {

        let dia = slDia1.options[slDia1.selectedIndex].value;

        if (dia === 'TS') {

            slHoraInicio1.disabled = true;
            slHoraFin1.disabled = true;

        } else {

            slHoraInicio1.disabled = false;
            slHoraFin1.disabled = false;
        }
    });

    slDia2.addEventListener('click', () => {

        let dia = slDia2.options[slDia2.selectedIndex].value;

        if (dia === 'TS') {

            slHoraInicio2.disabled = true;
            slHoraFin2.disabled = true;

        } else {

            slHoraInicio2.disabled = false;
            slHoraFin2.disabled = false;
        }
    });
};