$(document).ready(function () {

  function filterSolicitudes(solicitudes, selectedStatuses, selectedDate, selectedAula, selectedHoraInicio) {
    return solicitudes.filter(solicitud => {
      const matchesStatus = selectedStatuses.includes(solicitud.Estatus);
      const matchesDate = !selectedDate || solicitud.FechaPrestamo === selectedDate;
      const matchesAula = !selectedAula || solicitud.Aula === selectedAula;
      const matchesHora = !selectedHoraInicio || solicitud.HoraInicio === selectedHoraInicio; 

      return matchesStatus && matchesDate && matchesAula && matchesHora;
    });
  }


  GetAulasPrestamo();

  function renderSolicitudesAulas(solicitudes) {
    $('#ResultadoAulas').empty();

    if (solicitudes.length > 0) {
      solicitudes.forEach(function (solicitud) {
        const fila = $('<tr></tr>');

        const acciones = $('<td></td>');

        const btnBorrar = $('<span></span>')
          .addClass('icon-delete_outline')
          .attr('title', 'Eliminar')
          .click(() => borrarSolicitud(solicitud.ID_Prestamo));
        acciones.append(btnBorrar);

        const btnRechazar = $('<span></span>')
          .addClass('icon-cancel')
          .attr('title', 'Rechazar')
          .click(() => RechazarSolicitud(solicitud.ID_Prestamo));
        acciones.append(btnRechazar);

        const btnAprobarAula = $('<span></span>')
          .addClass('icon-meeting_room')
          .attr('title', 'Aprobar Prestamo')
          .click(() => aprobarAula(solicitud.ID_Prestamo));
        acciones.append(btnAprobarAula);

        const btnConfirmarAula = $('<span></span>')
          .addClass('icon-check_box')
          .attr('title', 'Confirmar Prestamo')
          .click(() => confirmarAula(solicitud.ID_Prestamo));
        acciones.append(btnConfirmarAula);

        const btnCerradoAula = $('<span></span>')
          .addClass('icon-block')
          .attr('title', 'Cerrado de Prestamo')
          .click(() => cerradoAula(solicitud.ID_Prestamo));
        acciones.append(btnCerradoAula);

        fila.append(acciones);

        fila.append('<td>' + valorOPorDefecto(solicitud.Creador) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.Perfil) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.ID_Prestamo) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.Aula) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.Fecha_Alta) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.FechaPrestamo) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.HoraInicio) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.HoraFin) + '</td>');

        // Columna de estatus con color
        const celdaEstatus = $('<td></td>').text(valorOPorDefecto(solicitud.Estatus));
        switch (solicitud.Estatus) {
          case 'CONFIRMADO':
            celdaEstatus.css('background-color', '#18792e'); // Verde
            break;
          case 'CERRADO':
            celdaEstatus.css('background-color', '#858585'); // Gris
            break;
          case 'APROBADA':
            celdaEstatus.css('background-color', '#18792e'); // Azul
            break;
          case 'RECHAZADA':
            celdaEstatus.css('background-color', '#920c0c'); // Rojo
            break;
          case 'PENDIENTE':
            celdaEstatus.css('background-color', '#c48002'); // Amarillo
            break;
          default:
            celdaEstatus.css('background-color', '#df4343'); // Rojo por defecto
            break;
        }
        fila.append(celdaEstatus);

        // Agregar las demás columnas
        fila.append('<td>' + valorOPorDefecto(solicitud.AdminAprobado) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.AdminConfirma) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.FechaConfirmacion) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.Observaciones) + '</td>');
        fila.append('<td>' + valorOPorDefecto(solicitud.FechaCerrado) + '</td>');

        $('#ResultadoAulas').append(fila);
      });
    } else {
      $('#ResultadoAulas').append('<tr><td colspan="12">No hay solicitudes pendientes.</td></tr>');
    }
  }

  function GetAllSolicitudesAulas() {
    $('#ResultadoAulas').empty();
    $.ajax({
      type: 'POST',
      url: 'controllers/aulas_controller.php',
      data: JSON.stringify({ type: 'GetNew' }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        if (response.data && response.data.length > 0) {
          const selectedStatuses = Array.from(document.querySelectorAll('input[name="estadoa"]:checked'))
            .map(checkbox => checkbox.value);
          const selectedDate = $('#fechaPrestamoAulas').val();
          const selectedAula = $('#aulasPrestamo').val();
          const selectedHoraInicio = $('#horainicioPrestamoAulas').val();

          const filteredSolicitudes = filterSolicitudes(response.data, selectedStatuses, selectedDate, selectedAula, selectedHoraInicio);

          renderSolicitudesAulas(filteredSolicitudes);
        } else {
          

          $('#ResultadoAulas').append('<tr><td colspan="12">No hay solicitudes pendientes.</td></tr>');
        }
      },
      error: function (xhr, status, error) {
        console.error('Error al obtener los datos de aulas solicitadas');
      }
    });
  }

  function valorOPorDefecto(valor) {
    return valor !== null && valor !== undefined && valor !== '' ? valor : 'N/A';
  }

  function borrarSolicitud(idSolicitud) {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar esta solicitud?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      .then(result => {
        if (result.isConfirmed) {
          $.ajax({
            type: 'POST',
            url: 'controllers/aulas_controller.php',
            data: JSON.stringify({
              type: 'Delete',
              idSolicitud: idSolicitud
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
              swal
                .fire({
                  title: 'Solicitud eliminada',
                  text: 'La solicitud ha sido eliminada exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                .then(() => {
                  GetAllSolicitudesAulas()
                })
            },
            error: function (xhr, status, error) {
              console.error(error)
            }
          })
        }
      })
  }
  function RechazarSolicitud(idSolicitud) {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¿Deseas rechazar esta solicitud?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
      })
      .then(result => {
        if (result.isConfirmed) {
          $.ajax({
            type: 'POST',
            url: 'controllers/aulas_controller.php',
            data: JSON.stringify({
              type: 'Decline',
              idSolicitud: idSolicitud
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
              swal
                .fire({
                  title: 'Solicitud rechazada',
                  text: 'La solicitud ha sido rechazada exitosamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
                })
                .then(() => {
                  GetAllSolicitudesAulas()
                })
            },
            error: function (xhr, status, error) {
              console.error(error)
            }
          })
        }
      })
  }

  function aprobarAula(idSolicitud) {
    $.ajax({
      type: 'POST',
      url: 'controllers/aulas_controller.php',
      data: JSON.stringify({
        type: 'AprobarAula',
        idSolicitud: idSolicitud
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        swal
          .fire({
            title: 'Aula aprobada',
            text: 'El aula ha sido aprobada exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          .then(() => {
            GetAllSolicitudesAulas()
          })
      },
      error: function (xhr, status, error) {
        console.log(error)
      }
    })  
  }


  function confirmarAula(idSolicitud) {
    $.ajax({
      type: 'POST',
      url: 'controllers/aulas_controller.php',
      data: JSON.stringify({
        type: 'ConfirmarPrestamo',
        idSolicitud: idSolicitud
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        swal
          .fire({
            title: 'Confirmación de prestamo de aula',
            text: 'La confirmación del aula ha sido exitosa',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          .then(() => {
            GetAllSolicitudesAulas()
          })
      },
      error: function (xhr, status, error) {
        console.log(error)
      }
    })
  }

  function cerradoAula(idPrestamo) {
    Swal.fire({
      title: 'Cierre de Préstamo',
      html: `
      <label>
        <input type="checkbox" id="checkboxAnomalia"> Anomalía
      </label>
      <br />
      <div id="observacionesDiv" class="d-flex flex-column align-items-center" style="display: none;">
        <label for="observaciones">Observaciones:</label>
        <textarea id="observaciones" class="swal2-textarea" placeholder="Ingrese las observaciones aquí..."></textarea>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Cerrar Préstamo',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const anomaliaChecked = document.getElementById('checkboxAnomalia').checked;
        const observaciones = anomaliaChecked ? document.getElementById('observaciones').value.trim() : '';

        if (anomaliaChecked && !observaciones) {
          Swal.showValidationMessage('Por favor, ingrese las observaciones.');
          return;
        }

        return {
          idPrestamo,
          anomalia: anomaliaChecked,
          observaciones: observaciones
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = result.value;
        $.ajax({
          type: 'POST',
          url: 'controllers/aulas_controller.php',
          data: JSON.stringify({
            type: 'CerrarPrestamo',
            idPrestamo: formData.idPrestamo,
            anomalia: formData.anomalia,
            observaciones: formData.observaciones
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
                title: 'Éxito',
                text: 'El préstamo ha sido cerrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                GetAllSolicitudesAulas();
              });
            }
          },
          error: function (xhr, status, error) {
            console.error('Error al cerrar el préstamo:', error);
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

    document.getElementById('checkboxAnomalia').addEventListener('change', function () {
      const observacionesDiv = document.getElementById('observacionesDiv');
      observacionesDiv.style.display = this.checked ? 'block' : 'none';
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
        swal
          .fire({
            title: 'Máquina aprobada',
            text: 'La máquina ha sido aprobada exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          .then(() => {
            GetAllSolicitudesAulas()
          })
      },
      error: function (xhr, status, error) {
        console.error(error)
      }
    })
  }

  GetAllSolicitudesAulas()


  document.querySelectorAll('input[name="estadoa"]').forEach(checkbox => {
    checkbox.addEventListener('change', GetAllSolicitudesAulas);
  });

  document.getElementById('marcarTodoBtnAulas').addEventListener('click', () => {
    document.querySelectorAll('input[name="estadoa"]').forEach(checkbox => checkbox.checked = true);
    GetAllSolicitudesAulas();
  });

  document.getElementById('desmarcarTodoBtnAulas').addEventListener('click', () => {
    document.querySelectorAll('input[name="estadoa"]').forEach(checkbox => checkbox.checked = false);
    GetAllSolicitudesAulas();
  });

  $('#fechaPrestamoAulas, #aulasPrestamo, #horainicioPrestamoAulas').on('change', function () {
    GetAllSolicitudesAulas();
});

  function GetAulasPrestamo() {
    $.ajax({
      type: 'POST',
      url: 'controllers/aulasConfig_controller.php',
      data: JSON.stringify({
        type: 'Get'
      }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log('Respuesta del servidor:', response);
        if (response.data && response.data.length > 0) {
          response.data.forEach(function (solicitud) {
            var option = $('<option></option>')
              .val(solicitud.nombre)
              .text(solicitud.nombre);
            $('#aulasPrestamo').append(option);

          });
        } else {
        }
      },
      error: function (xhr, status, error) {
        console.error('Error al obtener los datos de aulas', error);
      }
    });
  }


});


