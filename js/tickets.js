import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile } from "../utility.js";

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("Cancelar").addEventListener("click", function () {
        window.location.href = "maestrosmain";
    });

    GetAulas();

    function GetAulas() {
        $.ajax({
          type: 'POST',
          url: 'controllers/aulasConfig_controller.php',
          data: JSON.stringify({
            type: 'Get'
          }),
          dataType: 'json',
          contentType: 'application/json',
          success: function (response) {
            console.log('Respuesta del servidor:', response); // Depuración
            // Limpiar el contenido existente en el tbody
            $('#ResultadosConfigAulas').empty();
    
            if (response.data && response.data.length > 0) {
              response.data.forEach(function (solicitud) {
                var option = $('<option></option>')
                .val(solicitud.nombre) 
                .text(solicitud.nombre); 
                $('#aulas').append(option);
              });
            } else {
              // Mostrar un mensaje si no hay datos
              $('#ResultadosConfigAulas').append('<tr><td colspan="2">No hay aulas disponibles.</td></tr>');
            }
          },
          error: function (xhr, status, error) {
            // Manejar errores si la solicitud no se completa correctamente
            console.error('Error al obtener los datos de aulas solicitadas', error);
          }
        });
      }



    const form = document.getElementById('altaDeTicket');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Cancelar el envío del formulario por defecto

        // Validar los campos aquí
        const aulaInput = document.getElementById('aulas');
        const equipoInput = document.getElementById('equipo');
        const descripcionInput = document.getElementById('descripcion');

        if (aulaInput.value.trim() === '') {
            alert('Por favor ingresa el número de aula.');
            return;
        }

        if (equipoInput.value.trim() === '' && equipoInput.value > 0) {
            alert('Por favor ingresa el número de equipo.');
            return;
        }

        if (descripcionInput.value.trim() === '') {
            alert('Por favor ingresa la descripción del requerimiento.');
            return;
        }

        // Si todos los campos son válidos, puedes enviar el formulario manualmente
        // form.submit();
        // console.log("Ya pasó")
        const response = await makeRequest("controllers/ticketsController.php",
            {
                type: "Add",
                ...{
                    aula: aulaInput.value.trim(),
                    equipo: equipoInput.value.trim(),
                    descripcion: descripcionInput.value.trim()
                }
            });

        if (response.data !== null) {
            if (response.error == false) {
                Swal.fire({
                    icon: 'success',
                    title: response.data,
                    // text: 'Iniciando sesión...',
                    //   html: 'I will close in <b></b> milliseconds.',
                    timer: 1500,
                    timerProgressBar: true,
                    showConfirmButton: false,
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
                        window.location.replace("register");

                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.data,
                    confirmButtonText: 'Intentar de nuevo',
                    allowOutsideClick: false,
                    confirmButtonColor: '#006064',
                })
                document.body.className = '';
            }
        }


    });
});
