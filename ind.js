import { initializeApp, showMessage, makeRequest, inputFilter } from "./utility.js";

initializeApp();

const login = async () => {
    const loginFrm = document.getElementById("login");
    if (loginFrm) {
        let matricula = document.getElementById("matricula");
        let contraseña = document.getElementById("contraseña");
        if (matricula && contraseña) {
            matricula = matricula.value.trim();
            contraseña = contraseña.value.trim();
            if (matricula.length > 0 && contraseña.length > 0) {
                const response = await makeRequest("login.php", {
                    matricula,
                    contraseña,
                });
                if (response.error) {
                    // showMessage("wrapper", "Error", response.data, true);
                    Swal.fire({
                        icon: 'error',
                        title: response.data,
                        confirmButtonText: 'Reintentar',
                        allowOutsideClick: false,
                        confirmButtonColor: '#408DFC',
                        background: '#1F2540',
                        color: '#ffffff',
                    })
                    document.body.className = '';
                }
                else {
                    // showMessage("wrapper", "Redirigiendo", "Iniciando sesión...", false);
                    // Swal.fire({
                    //     icon: 'success',
                    //     title: 'Redirigiendo',
                    //     text: 'Iniciando sesión...',
                    //     timer: 1500,
                    //     showConfirmButton: false,
                    //     allowOutsideClick: false
                    // })

                    // let timerInterval
                    Swal.fire({
                        icon: 'success',
                        title: 'Redirigiendo',
                        text: 'Iniciando sesión...',
                        //   html: 'I will close in <b></b> milliseconds.',
                        timer: 1500,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        confirmButtonColor: '#408DFC',
                        background: '#1F2540',
                        color: '#ffffff',
                        didOpen: () => {
                            // Swal.showLoading()
                            // const b = Swal.getHtmlContainer().querySelector('b')
                            // timerInterval = setInterval(() => {
                            //     b.textContent = Swal.getTimerLeft()
                            // }, 100)
                        },
                        willClose: () => {
                            // clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            // console.log('I was closed by the timer')
                            window.location.replace("main");

                        }
                    })

                    // const Toast = Swal.mixin({
                    //     toast: true,
                    //     position: 'top-end',
                    //     showConfirmButton: false,
                    //     timer: 2000,
                    //     timerProgressBar: true,
                    //     didOpen: (toast) => {
                    //       toast.addEventListener('mouseenter', Swal.stopTimer)
                    //       toast.addEventListener('mouseleave', Swal.resumeTimer)
                    //     }
                    //   })

                    //   Toast.fire({
                    //     icon: 'success',
                    //     title: 'Iniciando sesión...'
                    //   })

                    document.body.className = '';
                    // setTimeout(() => {
                    //     window.location.replace("main");
                    // }, 2000);
                }
            } else {
                if (!matricula) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Ingrese su matrícula',
                        confirmButtonText: 'Reintentar',
                        allowOutsideClick: false,
                        confirmButtonColor: '#408DFC',
                        background: '#1F2540',
                        color: '#ffffff',
                    })
                    document.body.className = '';

                    // console.log("Falta matrícula")
                } else if (!contraseña) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Ingrese su contraseña',
                        // showDenyButton: true,
                        // showCancelButton: true,
                        confirmButtonText: 'Reintentar',
                        allowOutsideClick: false,
                        confirmButtonColor: '#408DFC',
                        background: '#1F2540',
                        color: '#ffffff',
                        // denyButtonText: `Don't save`,
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        // if (result.isConfirmed) {
                        //   Swal.fire('Saved!', '', 'success')
                        // } else if (result.isDenied) {
                        //   Swal.fire('Changes are not saved', '', 'info')
                        // }
                    })
                    document.body.className = '';
                    // console.log("Falta contraseña")
                }
            }
        }
        // console.log("No tiene nada")
    }
}

const mat = document.getElementById("matricula");
if (mat) {
    inputFilter(mat, value => /^\d*$/.test(value))
}
const contra = document.getElementById("contraseña");
if (contra) {
    contra.addEventListener("keydown", (ev) => {
        if (ev.keyCode == 13) {
            login();
        }
    });
}
const btnlogin = document.getElementById("btnLogin");
if (btnlogin) {
    btnlogin.addEventListener("click", async () => {
        login();

    });
}