

$(document).ready(function () {


function filterSolicitudes(solicitudes, selectedStatuses, selectedDate, selectedHoraInicio) {
  console.log(solicitudes);
  return solicitudes.filter(solicitud => {
    const matchesStatus = selectedStatuses.includes(solicitud.Estatus);
    const matchesDate = !selectedDate || solicitud.FechaPrestamo === selectedDate;
    const matchesHora = !selectedHoraInicio || solicitud.HoraInicio === selectedHoraInicio; 

    return matchesStatus && matchesDate && matchesHora;
  });
}


function renderSolicitudeEquipos(solicitudes) {
  $('#resultadosequipos').empty();
  if (solicitudes.length > 0) {
    solicitudes.forEach(function (solicitud) {
      var fila = $('<tr></tr>');

      const acciones = document.createElement('td');

      const btnBorrar = document.createElement('span');
      const btnRechazar = document.createElement('span');
      const btnAprobarEquipo = document.createElement('span');
      const btnConfirmarEquipo = document.createElement('span');
      const btnCerrarEquipo = document.createElement('span');

      btnBorrar.className = 'icon-delete_outline';
      btnBorrar.setAttribute('title', 'Eliminar');
      btnBorrar.onclick = function () {
        borrarSolicitudEquipo(solicitud.ID_PrestamoEquipo);
      };
      acciones.appendChild(btnBorrar);

      btnRechazar.className = 'icon-cancel';
      btnRechazar.setAttribute('title', 'Rechazar');
      btnRechazar.onclick = function () {
        RechazarSolicitudEquipo(solicitud.ID_PrestamoEquipo);
      };
      acciones.appendChild(btnRechazar);

      btnAprobarEquipo.className = 'icon-meeting_room';
      btnAprobarEquipo.setAttribute('title', 'Aprobar Prestamo');
      btnAprobarEquipo.onclick = function () {
        aprobarPrestamoEquipo(solicitud.ID_PrestamoEquipo);
      };


      acciones.appendChild(btnAprobarEquipo)

      btnConfirmarEquipo.className = 'icon-check_box';
      btnConfirmarEquipo.setAttribute('title', 'Confirmar Prestamo');
      btnConfirmarEquipo.onclick = function () {
        confirmarEquipo(solicitud.ID_PrestamoEquipo);
      };


      acciones.appendChild(btnConfirmarEquipo)

      btnCerrarEquipo.className = 'icon-block';
      btnCerrarEquipo.setAttribute('title', 'Cerrado de Prestamo');
      btnCerrarEquipo.onclick = function () {
        cerrarEquipo(solicitud.ID_PrestamoEquipo);
      };

      acciones.appendChild(btnCerrarEquipo)


      fila.append(acciones);

      // Agregar los datos a la fila
      fila.append('<td>' + valorOPorDefecto(solicitud.Creador) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.Perfil) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.ID_PrestamoEquipo) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.Equipo) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.Fecha_Alta) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.FechaPrestamo) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.HoraInicio) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.HoraFin) + '</td>');

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
          celdaEstatus.css('background-color', '#df4343'); // Rojo
          break;
        case 'PENDIENTE':
          celdaEstatus.css('background-color', '#c48002'); // Amarillo
          break;
        default:
          celdaEstatus.css('background-color', '#df4343'); // Rojo por defecto
          break;
      }


      fila.append(celdaEstatus);

      fila.append('<td>' + valorOPorDefecto(solicitud.AdminAprobado) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.AdminConfirma) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.FechaConfirmacion) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.Observaciones) + '</td>');
      fila.append('<td>' + valorOPorDefecto(solicitud.FechaCerrado) + '</td>');

      console.log(fila);

      $('#resultadosequipos').append(fila);
    });
  } else {
    $('#resultadosequipos').append(
      '<tr><td colspan="12">No hay solicitudes pendientes.</td></tr>'
    );
  }

}


function GetSolicitudes() {
  $.ajax({
    type: 'POST',
    url: 'controllers/equipos_controller.php',
    data: JSON.stringify({
      type: 'GetNew'
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (response) {
        if (response.data && response.data.length > 0) {
          const selectedStatuses = Array.from(document.querySelectorAll('input[name="estadop"]:checked'))
            .map(checkbox => checkbox.value);
          const selectedDate = $('#fechaPrestamoEquipos').val();
          const selectedHoraInicio = $('#horainicioPrestamoEquipos').val();
          const filteredSolicitudes = filterSolicitudes(response.data, selectedStatuses, selectedDate, selectedHoraInicio);

          renderSolicitudeEquipos(filteredSolicitudes);
        } else {
          $('#resultadosequipos').append('<tr><td colspan="12">No hay solicitudes pendientes.</td></tr>');
        }
    
    },
    error: function (xhr, status, error) {
      console.error('Error al obtener los datos de prestamos de equipos');
    }
  });
}

function valorOPorDefecto(valor) {
  return valor !== null && valor !== undefined && valor !== '' ? valor : 'N/A';
}

function borrarSolicitudEquipo(idSolicitud) {
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
          url: 'controllers/equipos_controller.php',
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
                GetSolicitudes()
              })
          },
          error: function (xhr, status, error) {
            console.error(error)
          }
        })
      }
    })
}

function RechazarSolicitudEquipo(idSolicitud) {
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
          url: 'controllers/equipos_controller.php',
          data: JSON.stringify({
            type: 'DeclineEquipo',
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
                GetSolicitudes()
              })
          },
          error: function (xhr, status, error) {
            console.error(error)
          }
        })
      }
    })
}

function aprobarPrestamoEquipo(idSolicitud) {
  $.ajax({
    type: 'POST',
    url: 'controllers/equipos_controller.php',
    data: JSON.stringify({
      type: 'AprobarEquipo',
      idSolicitud: idSolicitud
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (response) {
      swal
        .fire({
          title: 'Solicitud de equipo aprobado',
          text: 'La solicitud de equipo ha sido aprobada exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        .then(() => {
          GetSolicitudes()
        })
    },
    error: function (xhr, status, error) {
      console.log(error)
    }
  })
}


function confirmarEquipo(idSolicitud) {
  $.ajax({
    type: 'POST',
    url: 'controllers/equipos_controller.php',
    data: JSON.stringify({
      type: 'ConfirmarPrestamoEquipo',
      idSolicitud: idSolicitud
    }),
    dataType: 'json',
    contentType: 'application/json',
    success: function (response) {
      swal
        .fire({
          title: 'Confirmación de prestamo de equipo',
          text: 'La confirmación del prestamo de equipo ha sido exitosa',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        .then(() => {
          GetSolicitudes()
        })
    },
    error: function (xhr, status, error) {
      console.log(error)
    }
  })
}

function cerrarEquipo(idPrestamo) {
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
        url: 'controllers/equipos_controller.php',
        data: JSON.stringify({
          type: 'CerrarPrestamoEquipo',
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
              text: 'El préstamo de equipo ha sido cerrado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              GetSolicitudes();
            });
          }
        },
        error: function (xhr, status, error) {
          console.error('Error al cerrar el préstamo de equipo:', error);
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


document.querySelectorAll('input[name="estadop"]').forEach(checkbox => {
  checkbox.addEventListener('change', GetSolicitudes);
});

document.getElementById('marcarTodoBtnEquipos').addEventListener('click', () => {
  document.querySelectorAll('input[name="estadop"]').forEach(checkbox => checkbox.checked = true);
  GetSolicitudes();
});

document.getElementById('desmarcarTodoBtnEquipos').addEventListener('click', () => {
  document.querySelectorAll('input[name="estadop"]').forEach(checkbox => checkbox.checked = false);
  GetSolicitudes();
});

$('#fechaPrestamoEquipos, #horainicioPrestamoEquipos').on('change', function () {
  GetSolicitudes();
});


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
          // Una vez que el usuario da clic en "Aceptar" en el cuadro de diálogo, activar la función GetSolicitudes
          GetSolicitudes()
        })
    },
    error: function (xhr, status, error) {
      // Manejar errores aquí
      console.error(error)
    }
  })
}

GetSolicitudes()

});