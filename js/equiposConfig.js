
import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile, showFormatMessage } from "../utility.js";


$(document).ready(function () {

  const crearEquipoBtn = document.getElementById('CrearEquipo');
  const modalEquipo = document.getElementById('ModalEquipo');
  const agregarEquipoBtn = document.getElementById('AgregarEquipo');
  const btnEquipoActivo = document.getElementById('BuscarEquipoA');
  const btnEquipoInactivo = document.getElementById('BuscarEquipoI');

  GetEquipos();

  $('#BuscarEquipoA').click(function (e) {
    e.preventDefault();
    GetEquipos();
  });

  

  $('#BuscarEquipoI').click(function (e) {
    e.preventDefault();
    GetEquiposInactivos();
  });


  function GetEquipos() {
    btnEquipoActivo.disabled = true;
    btnEquipoInactivo.disabled = false;
    $.ajax({
      type: 'POST',
      url: 'controllers/equipoConfig_controller.php',
      data: JSON.stringify({
        type: 'Get'
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log('Respuesta del servidor:', response); // Depuración
        $('#ResultadosConfigEquipos').empty();

        if (response.data && response.data.length > 0) {
          response.data.forEach(function (solicitud) {
            var fila = $('<tr></tr>');

            var acciones = $('<td></td>');

            var btnBorrar = $('<span></span>').addClass('icon-delete_outline')
              .attr('title', 'Desactivar')
              .click(function () {
                desactivarEquipo(solicitud.id);
              });
            acciones.append(btnBorrar);

            var btnEditar = $('<span></span>').addClass('icon-create')
              .attr('title', 'Editar')
              .click(function () {
                editarEquipo(solicitud.id, solicitud.nombre);
              });
            acciones.append(btnEditar);

            fila.append(acciones);

            fila.append('<td>' + solicitud.nombre + '</td>');

            $('#ResultadosConfigEquipos').append(fila);
          
          });
        } else {
          $('#ResultadosConfigEquipos').append('<tr><td colspan="2">No existen equipos.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error al obtener los datos de aulas solicitadas', error);
      }
    });
  }

  function GetEquiposInactivos() {
    btnEquipoActivo.disabled = false;
    btnEquipoInactivo.disabled = true;
    $.ajax({
      type: 'POST',
      url: 'controllers/equipoConfig_controller.php',
      data: JSON.stringify({
        type: 'GetInactivos'
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log('Respuesta del servidor:', response); // Depuración
        $('#ResultadosConfigEquipos').empty();

        if (response.data && response.data.length > 0) {
          response.data.forEach(function (solicitud) {
            var fila = $('<tr></tr>');

            var acciones = $('<td></td>');

            var btnReactivar = $('<span></span>').addClass('icon-history')
              .attr('title', 'Reactivar')
              .click(function () {
                reactivarEquipo(solicitud.id);
              });
            acciones.append(btnReactivar);

            var btnEditar = $('<span></span>').addClass('icon-create')
              .attr('title', 'Editar')
              .click(function () {
                editarEquipo(solicitud.id, solicitud.nombre);
              });
            acciones.append(btnEditar);

            fila.append(acciones);

            fila.append('<td>' + solicitud.nombre + '</td>');
            $('#ResultadosConfigEquipos').append(fila);
          
          });
        } else {
          $('#ResultadosConfigEquipos').append('<tr><td colspan="2">No existen equipos inactivos.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error al obtener los datos de los equipos', error);
      }
    });
  }

  function prepareEquipo(Id, alumno) {
    modalEquipo.open = true
  }

  crearEquipoBtn.addEventListener('click', function () {
    prepareEquipo(null, null);
  });

  if (agregarEquipoBtn) {
    agregarEquipoBtn.addEventListener('click', function () {
      const equipoNombre = $('#nombreEquipo').val();
      $.ajax({
        type: 'POST',
        url: 'controllers/equipoConfig_controller.php',
        data: JSON.stringify({
          type: 'AgregarEquipo',
          nombre: equipoNombre,
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
          console.log('Respuesta del servidor:', response);

          if (response.error) {
            swal.fire({
              title: 'Error',
              text: response.data,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          } else {
            swal.fire({
              title: 'Equipo agregado',
              text: response.data,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              const modalEquipo = document.getElementById('ModalEquipo');
              if (modalEquipo && typeof modalEquipo.close === 'function') {
                modalEquipo.close();
              } else {
                console.log('Método close no disponible para el modal.');
              }
              GetEquipos();
            });
          }
        },
        error: function (xhr, status, error) {
          console.error('Error al agregar el equipo', error);
          swal.fire({
            title: 'Error',
            text: 'Hubo un problema al agregar el equipo. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    });
  }

  function desactivarEquipo(idSolicitud) {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¿Deseas desactivar este equipo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      })
      .then(result => {
        if (result.isConfirmed) {
          $.ajax({
            type: 'POST',
            url: 'controllers/equipoConfig_controller.php',
            data: JSON.stringify({
              type: 'DesactivarEquipo',
              idSolicitud: idSolicitud
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
              // Manejar la respuesta de éxito aquí
              swal
                .fire({
                  title: 'Equipo desactivado',
                  text: 'El equipo ha sido desactivado exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                .then(() => {
                  GetEquiposInactivos();
                })
            },
            error: function (xhr, status, error) {
              // Manejar errores aquí
              console.error(error)
            }
          })
        }
      })
  }


  function reactivarEquipo(idSolicitud) {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¿Deseas reactivar este Equipo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reactivar',
        cancelButtonText: 'Cancelar'
      })
      .then(result => {
        if (result.isConfirmed) {
          $.ajax({
            type: 'POST',
            url: 'controllers/equipoConfig_controller.php',
            data: JSON.stringify({
              type: 'ReactivarEquipo',
              idSolicitud: idSolicitud
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
              // Manejar la respuesta de éxito aquí
              GetEquipos();
              swal
                .fire({
                  title: 'Equipo reactivado',
                  text: 'El equipo ha sido reactivado exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                .then(() => {
                  GetEquipos();
                })
            },
            error: function (xhr, status, error) {
              // Manejar errores aquí
              console.error(error)
            }
          })
        }
      })
  }


  function editarEquipo(id, nombreActual) {
    Swal.fire({
      title: 'Editar Equipo',
      html: `
            <label for="nombreEquipo">Nombre del Equipo:</label>
            <div class="d-flex align-items-center justify-content-center">
            <input id="nombreEquipo" class="swal2-input" type="text" value="${nombreActual}" minlength="1" required>
             </div>
            <br />
        `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const popup = Swal.getPopup();
        const nombre = popup.querySelector('#nombreEquipo').value.trim();

        // Validaciones
        if (!nombre) {
          Swal.showValidationMessage('El nombre del equipo no puede estar vacío.');
          return false;
        }

        return { nombre};
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre } = result.value;

        $.ajax({
          type: 'POST',
          url: 'controllers/equipoConfig_controller.php',
          data: JSON.stringify({
            type: 'EditarEquipo',
            id: id,
            nombre: nombre,
          }),
          dataType: 'json',
          contentType: 'application/json',
          success: function (response) {
            Swal.fire({
              title: response.error ? 'Error' : 'Éxito',
              text: response.data,
              icon: response.error ? 'error' : 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              if (!response.error) {
                GetEquipos();
              }
            });
          },
          error: function (xhr, status, error) {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al actualizar el equipo.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }



});
