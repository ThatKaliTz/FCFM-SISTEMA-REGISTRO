
import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal, loadFile, showFormatMessage } from "../utility.js";


$(document).ready(function () {

  const crearAulaBtn = document.getElementById('CrearAula');
  const modalAulas = document.getElementById('ModalAulas');
  const agregarAulaBtn = document.getElementById('AgregarAula');
  const btnAulasActivas = document.getElementById('BuscarAulasA');
  const btnAulasInactivas = document.getElementById('BuscarAulasI');

  GetAulas();

  $('#BuscarAulasA').click(function (e) {
    e.preventDefault();
    GetAulas();

  });


  $('#BuscarAulasI').click(function (e) {
    e.preventDefault();
    GetAulasInactivas();
  });


  function GetAulas() {
    btnAulasActivas.disabled = true;
    btnAulasInactivas.disabled = false;
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
            var fila = $('<tr></tr>');

            var acciones = $('<td></td>');

            var btnBorrar = $('<span></span>').addClass('icon-delete_outline')
              .attr('title', 'Desactivar')
              .click(function () {
                desactivarAula(solicitud.id);
              });
            acciones.append(btnBorrar);

            var btnEditar = $('<span></span>').addClass('icon-create')
              .attr('title', 'Editar')
              .click(function () {
                editarAula(solicitud.id, solicitud.nombre, solicitud.capacidad);
              });
            acciones.append(btnEditar);

            var btnAgregarHorario = $('<span></span>').addClass('icon-add_circle_outline')
              .attr('title', 'Agregar Horario')
              .click(function () {
                agregarHorario(solicitud.id);
              });
            acciones.append(btnAgregarHorario);

            fila.append(acciones);

            fila.append('<td>' + solicitud.nombre + '</td>');

            fila.append('<td>' + solicitud.capacidad + '</td>');

            var accionesHorario = $('<td></td>');

            var btnVerHorarios = $('<span></span>')
              .addClass('icon-add_circle_outline btn btn-sm')
              .attr('title', 'Checar Horarios')
              .text('Ver Horarios')
              .css({
                'margin-top': '0.2rem',
                'background-color': '#408DFC',
                'color': 'white',
                'border-color': '#408DFC'
              })
              .click(function () {
                verHorarios(solicitud.id);
              });

            var accionesHorario = $('<div></div>')
              .addClass('d-flex justify-content-center')

            accionesHorario.append(btnVerHorarios);
            fila.append(accionesHorario);

            var accionesPrestamo = $('<td></td>').css({
              'max-width': '0.01rem'
            });;

            var checkboxDiv = $('<div></div>').addClass('form-check d-flex justify-content-center mb-4')

            var checkboxPrestable = $('<input type="checkbox">')
              .addClass('form-check-input')
              .attr('id', 'checkbox_' + solicitud.id)
              .prop('checked', solicitud.prestable === 1)
              .click(function () {
                togglePrestable(solicitud.id, $(this).is(':checked') ? 1 : 0); 
              });

            var checkboxLabel = $('<label></label>')
              .addClass('form-check-label')
              .attr('for', 'checkbox_' + solicitud.id);

            checkboxDiv.append(checkboxPrestable).append(checkboxLabel);
            accionesPrestamo.append(checkboxDiv);


            fila.append(accionesPrestamo);


            $('#ResultadosConfigAulas').append(fila);

            var option = $('<option></option>')
              .val(solicitud.nombre)
              .text(solicitud.nombre);
            $('#mgmaula').append(option);

          });
        } else {
          $('#ResultadosConfigAulas').append('<tr><td colspan="2">No hay solicitudes pendientes.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error al obtener los datos de aulas solicitadas', error);
      }
    });
  }


  function verHorarios(idAula) {
    $.ajax({
      type: 'POST',
      url: 'controllers/aulasConfig_controller.php',
      data: JSON.stringify({
        type: 'GetHorarios',
        id: idAula
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
          let dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
          let html = '<div class="table-responsive">';

          dias.forEach(function (dia) {
            html += `<h5 class="text-center mt-4">${dia}</h5>`;
            html += `<table class="table table-bordered mb-4">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Hora Inicio</th>
                                        <th>Hora Fin</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>`;

            const horariosDia = response.data.filter(horario => horario.Dia === dia);

            if (horariosDia.length > 0) {
              horariosDia.forEach(function (horario) {
                html += `
                                <tr>
                                    <td>${horario.HoraInicio}</td>
                                    <td>${horario.HoraFin}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm eliminar-horario" data-id="${horario.IdHorario}">Eliminar</button>
                                    </td>
                                </tr>`;
              });
            } else {
              html += `<tr><td colspan="3" class="text-center">No hay horarios</td></tr>`;
            }

            html += `</tbody></table>`;
          });

          html += '</div>';

          Swal.fire({
            title: 'Horarios del Aula',
            html: html,
            showCancelButton: false,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#408DFC',
            background: '#1F2540',
            color: '#ffffff',
          });

          $('.eliminar-horario').on('click', function () {
            const idHorario = $(this).data('id');
            eliminarHorario(idHorario);
          });

        }
      },
      error: function (xhr, status, error) {
        /*Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al obtener los horarios.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }); */
      }
    });
  }

  function GetAulasInactivas() {
    btnAulasActivas.disabled = false;
    btnAulasInactivas.disabled = true;
    $.ajax({
      type: 'POST',
      url: 'controllers/aulasConfig_controller.php',
      data: JSON.stringify({
        type: 'GetInactivas'
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log('Respuesta del servidor:', response); // Depuración
        $('#ResultadosConfigAulas').empty();

        if (response.data && response.data.length > 0) {
          response.data.forEach(function (solicitud) {
            var fila = $('<tr></tr>');

            var acciones = $('<td></td>');

            var btnReactivar = $('<span></span>').addClass('icon-history')
              .attr('title', 'Reactivar')
              .click(function () {
                reactivarAula(solicitud.id);
              });
            acciones.append(btnReactivar);


            fila.append(acciones);

            fila.append('<td>' + solicitud.nombre + '</td>');

            fila.append('<td>' + solicitud.capacidad + '</td>');


            var accionesHorario = $('<td></td>');

            var btnVerHorarios = $('<span></span>')
              .addClass('icon-add_circle_outline btn btn-sm')
              .attr('title', 'Checar Horarios')
              .text('Ver Horarios')
              .css({
                'margin-top': '0.2rem',
                'background-color': '#408DFC',
                'color': 'white',
                'border-color': '#408DFC'
              })
              .click(function () {
                verHorarios(solicitud.id);
              });

            var accionesHorario = $('<div></div>')
              .addClass('d-flex justify-content-center')

            accionesHorario.append(btnVerHorarios);
            fila.append(accionesHorario);

            // Agregar la fila a la tabla
            $('#ResultadosConfigAulas').append(fila);
          });
        } else {
          // Mostrar un mensaje si no hay datos
          $('#ResultadosConfigAulas').append('<tr><td colspan="2">No hay aulas inactivas.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        // Manejar errores si la solicitud no se completa correctamente
        console.error('Error al obtener los datos de aulas solicitadas', error);
      }
    });
  }



  function prepareAula(Id, alumno) {
    modalAulas.open = true
  }

  crearAulaBtn.addEventListener('click', function () {
    prepareAula(null, null);
  });


  if (agregarAulaBtn) {
    agregarAulaBtn.addEventListener('click', function () {
      const aulaNombre = $('#nombreAula').val();
      const capacidadAula = $('#capacidadAula').val();

      $.ajax({
        type: 'POST',
        url: 'controllers/aulasConfig_controller.php',
        data: JSON.stringify({
          type: 'AgregarAula',
          nombre: aulaNombre,
          capacidad: capacidadAula
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
          if (response.error) {
            swal.fire({
              title: 'Error',
              text: response.data,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          } else {
            swal.fire({
              title: 'Aula agregada',
              text: response.data,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              const modalAulas = document.getElementById('ModalAulas');
              if (modalAulas && typeof modalAulas.close === 'function') {
                modalAulas.close();
              } else {
                console.log('Método close no disponible para el modal.');
              }
              GetAulas();
            });
          }
        },
        error: function (xhr, status, error) {
          console.error('Error al agregar el aula', error);
          swal.fire({
            title: 'Error',
            text: 'Hubo un problema al agregar el aula. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    });
  }

  function desactivarAula(idSolicitud) {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¿Deseas desactivar esta aula?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      })
      .then(result => {
        if (result.isConfirmed) {
          $.ajax({
            type: 'POST',
            url: 'controllers/aulasConfig_controller.php',
            data: JSON.stringify({
              type: 'DesactivarAula',
              idSolicitud: idSolicitud
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
              // Manejar la respuesta de éxito aquí
              swal
                .fire({
                  title: 'Aula desactivada',
                  text: 'La aula ha sido desactivada exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                .then(() => {
                  GetAulasInactivas();
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


  function eliminarHorario(idHorario) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: 'POST',
          url: 'controllers/aulasConfig_controller.php',
          data: JSON.stringify({
            type: 'EliminarHorario',
            id: idHorario
          }),
          dataType: 'json',
          contentType: 'application/json',
          success: function (response) {
            if (response.error) {
              Swal.fire({
                title: 'Error',
                text: response.data,
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            } else {
              Swal.fire({
                title: 'Horario Eliminado',
                text: 'El horario ha sido eliminado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                verHorarios(idAula);
              });
            }
          },
          error: function (xhr, status, error) {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al eliminar el horario.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });

  }


  function reactivarAula(idSolicitud) {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¿Deseas reactivar esta aula?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reactivar',
        cancelButtonText: 'Cancelar'
      })
      .then(result => {
        if (result.isConfirmed) {
          $.ajax({
            type: 'POST',
            url: 'controllers/aulasConfig_controller.php',
            data: JSON.stringify({
              type: 'ReactivarAula',
              idSolicitud: idSolicitud
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
              // Manejar la respuesta de éxito aquí
              GetAulas();
              swal
                .fire({
                  title: 'Aula reactivada',
                  text: 'La aula ha sido reactivada exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                .then(() => {
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


  function editarAula(id, nombreActual, capacidadActual) {
    Swal.fire({
      title: 'Editar Aula',
      html: `
            <label for="nombreAula">Nombre del Aula:</label>
            <div class="d-flex align-items-center justify-content-center">
            <input id="nombreAula" class="swal2-input" type="text" value="${nombreActual}" minlength="1" required>
             </div>
            <br />
            <label for="capacidadAula">Capacidad:</label>
            <div class="d-flex align-items-center justify-content-center">
            <input id="capacidadAula" class="swal2-input" type="number" value="${capacidadActual}" min="0" required>
            </div>
        `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const popup = Swal.getPopup();
        const nombre = popup.querySelector('#nombreAula').value.trim();
        const capacidad = parseInt(popup.querySelector('#capacidadAula').value);

        // Validaciones
        if (!nombre) {
          Swal.showValidationMessage('El nombre del aula no puede estar vacío.');
          return false;
        }
        if (capacidad < 0) {
          Swal.showValidationMessage('La capacidad no puede ser menor que 0.');
          return false;
        }

        return { nombre, capacidad };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre, capacidad } = result.value;

        $.ajax({
          type: 'POST',
          url: 'controllers/aulasConfig_controller.php',
          data: JSON.stringify({
            type: 'EditarAula',
            id: id,
            nombre: nombre,
            capacidad: capacidad
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
                GetAulas();
              }
            });
          },
          error: function (xhr, status, error) {
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al actualizar el aula.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }



});


function agregarHorario(id) {
  Swal.fire({
    title: 'Agrega el horario',
    html: `
      <label for="dia">Día de la semana:</label>
      <select id="dia" class="swal2-input">
        <option value="LUNES">LUNES</option>
        <option value="MARTES">MARTES</option>
        <option value="MIERCOLES">MIERCOLES</option>
        <option value="JUEVES">JUEVES</option>
        <option value="VIERNES">VIERNES</option>
      </select>
      <br />
      <label for="horainicio">Hora de inicio:</label>
      <select id="horainicio" class="swal2-input">
        <option value="07:00:00">07:00</option>
        <option value="07:30:00">07:30</option>
        <option value="08:00:00">08:00</option>
        <option value="08:30:00">08:30</option>
        <option value="09:00:00">09:00</option>
        <option value="09:30:00">09:30</option>
        <option value="10:00:00">10:00</option>
        <option value="10:30:00">10:30</option>
        <option value="11:00:00">11:00</option>
        <option value="11:30:00">11:30</option>
        <option value="12:00:00">12:00</option>
        <option value="12:30:00">12:30</option>
        <option value="13:00:00">13:00</option>
        <option value="13:30:00">13:30</option>
        <option value="14:00:00">14:00</option>
        <option value="14:30:00">14:30</option>
        <option value="15:00:00">15:00</option>
        <option value="15:30:00">15:30</option>
        <option value="16:00:00">16:00</option>
        <option value="16:30:00">16:30</option>
        <option value="17:00:00">17:00</option>
        <option value="17:30:00">17:30</option>
        <option value="18:00:00">18:00</option>
        <option value="18:30:00">18:30</option>
        <option value="19:00:00">19:00</option>
        <option value="19:30:00">19:30</option>
        <option value="20:00:00">20:00</option>
        <option value="20:30:00">20:30</option>
        <option value="21:00:00">21:00</option>
        <option value="21:30:00">21:30</option>
      </select>
      <br />
      <label for="horafin">Hora de fin:</label>
      <select id="horafin" class="swal2-input">
        <option value="07:30:00">07:30</option>
        <option value="08:00:00">08:00</option>
        <option value="08:30:00">08:30</option>
        <option value="09:00:00">09:00</option>
        <option value="09:30:00">09:30</option>
        <option value="10:00:00">10:00</option>
        <option value="10:30:00">10:30</option>
        <option value="11:00:00">11:00</option>
        <option value="11:30:00">11:30</option>
        <option value="12:00:00">12:00</option>
        <option value="12:30:00">12:30</option>
        <option value="13:00:00">13:00</option>
        <option value="13:30:00">13:30</option>
        <option value="14:00:00">14:00</option>
        <option value="14:30:00">14:30</option>
        <option value="15:00:00">15:00</option>
        <option value="15:30:00">15:30</option>
        <option value="16:00:00">16:00</option>
        <option value="16:30:00">16:30</option>
        <option value="17:00:00">17:00</option>
        <option value="17:30:00">17:30</option>
        <option value="18:00:00">18:00</option>
        <option value="18:30:00">18:30</option>
        <option value="19:00:00">19:00</option>
        <option value="19:30:00">19:30</option>
        <option value="20:00:00">20:00</option>
        <option value="20:30:00">20:30</option>
        <option value="21:00:00">21:00</option>
        <option value="21:30:00">21:30</option>
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const dia = document.getElementById('dia').value;
      const horaInicio = document.getElementById('horainicio').value;
      const horaFin = document.getElementById('horafin').value;

      if (!dia || !horaInicio || !horaFin) {
        Swal.showValidationMessage('Por favor complete todos los campos');
        return;
      }

      if (horaInicio >= horaFin) {
        Swal.showValidationMessage('La hora de fin debe ser después de la hora de inicio');
        return;
      }

      return { dia, horaInicio, horaFin };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const formValues = result.value;

      $.ajax({
        type: 'POST',
        url: 'controllers/aulasConfig_controller.php',
        data: JSON.stringify({
          type: 'AgregarHorario',
          id: id,
          dia: formValues.dia,
          horaInicio: formValues.horaInicio,
          horaFin: formValues.horaFin
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
          if (response.error) {
            Swal.fire({
              title: 'Error',
              text: response.data,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          } else {
            Swal.fire({
              title: 'Horario agregado',
              text: response.data,
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
            });
          }
        },
        error: function (xhr, status, error) {
          console.error('Error al agregar horario:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al comunicarse con el servidor. Inténtelo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  });
}


function togglePrestable(id, prestable) {
  $.ajax({
      type: 'POST',
      url: 'controllers/aulasConfig_controller.php',
      data: JSON.stringify({
          type: 'TogglePrestable',
          id: id,
          prestable: prestable
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        swal
          .fire({
            title: 'PRESTAMO AULA',
            text: 'La aula ha sido modificada exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          .then(() => {
          })
      },
      error: function (xhr, status, error) {
        console.error(error)
      }
  });
}





function mostrarDialogo(idSolicitud) {
  // Mostrar el diálogo personalizado
  $('#customDialog').modal('show')

  // Manejar el evento de clic en el botón de Aprobar dentro del diálogo
  $('#confirmCustomDialog').click(function () {
    // Obtener los valores del formulario
    var aula = $('#inputAula').val()
    var maquina = $('#inputMaquina').val()

    // Realizar la aprobación de la máquina con los valores del formulario
    aprobarMaquina(idSolicitud, aula, maquina)

    // Cerrar el diálogo después de realizar la aprobación
    $('#customDialog').modal('hide')

    // Limpiar los campos del formulario para la próxima vez que se abra el diálogo
    $('#inputAula').val('')
    $('#inputMaquina').val('')

    // Desvincular el evento de clic para evitar múltiples llamadas
    $('#confirmCustomDialog').off('click')
  })
}

function aprobarMaquina(idSolicitud, aula, maquina) {
  // Realizar la solicitud AJAX para aprobar la máquina
  $.ajax({
    type: 'POST',
    url: 'controllers/aulas_controller.php',
    data: JSON.stringify({
      type: 'AprobarMaquina',
      idSolicitud: idSolicitud,
      aula: aula,
      maquina: maquina
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (response) {
      // Manejar la respuesta de éxito aquí
      swal
        .fire({
          title: 'Máquina aprobada',
          text: 'La máquina ha sido aprobada exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        .then(() => {
        })
    },
    error: function (xhr, status, error) {
      // Manejar errores aquí
      console.error(error)
    }
  })
}



document.getElementById('ConfigFechas').addEventListener('click', function () {
  $.ajax({
    type: 'POST',
      url: 'controllers/aulasConfig_controller.php',
      data: JSON.stringify({
        type: 'GetHorariosClases'
      }),
      dataType: 'json',
      contentType: 'application/json',
    success: function (response) {
      if (response.error) {
        Swal.fire({
          title: 'Error',
          text: response.data,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        const fechaInicio = response.data.Fecha_InicioClases || '';
        const fechaFin = response.data.Fecha_FinClases || '';

        Swal.fire({
          title: 'Configurar Fechas de Clases',
          html: `
                  <label for="fechaInicio">Fecha de Inicio de Clases:</label>
                  <input type="date" id="fechaInicioConfiguracion" class="swal2-input" value="${fechaInicio}" />
                  <br />
                  <label for="fechaFin">Fecha de Fin de Clases:</label>
                  <input type="date" id="fechaFinConfiguracion" class="swal2-input" value="${fechaFin}" />
            `,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const fechaInicio = document.getElementById('fechaInicioConfiguracion').value;
            const fechaFin = document.getElementById('fechaFinConfiguracion').value;

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
              url: 'controllers/aulasConfig_controller.php', 
              data: JSON.stringify({
                type: 'actualizarFechasClases',
                fechaInicio: formValues.fechaInicio,
                fechaFin: formValues.fechaFin
              }),
              dataType: 'json',
              contentType: 'application/json',
              success: function (response) {
                if (response.error) {
                  Swal.fire({
                    title: 'Error',
                    text: response.data,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  });
                } else {
                  Swal.fire({
                    title: 'Fechas actualizadas',
                    text: response.data,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                  });
                }
              },
              error: function (xhr, status, error) {
                console.error('Error al actualizar fechas:', error);
                Swal.fire({
                  title: 'Error',
                  text: 'Hubo un problema al comunicarse con el servidor. Inténtelo de nuevo.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
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
