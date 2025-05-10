// $(document).ready(function () {
//   $('#aula').change(function () {
//     if ($(this).val() === 'Otro') {
//       $('#otraAula').show()
//     } else {
//       $('#otraAula').hide()
//     }
//   })

//   // Función para generar las horas desde las 7:00 AM hasta las 7:00 PM
//   function generarHorasInicio () {
//     var horasInicio = []
//     for (var i = 7; i <= 19; i++) {
//       var hora = i < 10 ? '0' + i : i
//       horasInicio.push(hora + ':00')
//     }
//     return horasInicio
//   }

//   // Función para generar las horas desde las 8:00 AM hasta las 8:00 PM
//   function generarHorasFin () {
//     var horasFin = []
//     for (var i = 8; i <= 20; i++) {
//       var hora = i < 10 ? '0' + i : i
//       horasFin.push(hora + ':00')
//     }
//     return horasFin
//   }

//   // Generar las horas y agregarlas a los selectores de hora de inicio y fin
//   var horasInicioList = generarHorasInicio()
//   var horasFinList = generarHorasFin()

//   var selectHoraInicioAula = $('#horaInicio')
//   var selectHoraFinAula = $('#horaFin')
//   var selectHoraInicioMaquina = $('#horaInicioMaquina')
//   var selectHoraFinMaquina = $('#horaFinMaquina')

//   horasInicioList.forEach(function (horaInicio) {
//     var optionInicio = $('<option></option>')
//     optionInicio.text(horaInicio)
//     optionInicio.val(horaInicio)

//     // Agregar opciones para las solicitudes de aula
//     selectHoraInicioAula.append(optionInicio)

//     // Agregar opciones para las solicitudes de máquina
//     selectHoraInicioMaquina.append(optionInicio.clone())
//   })

//   horasFinList.forEach(function (horaFin) {
//     var optionFin = $('<option></option>')
//     optionFin.text(horaFin)
//     optionFin.val(horaFin)

//     // Agregar opciones para las solicitudes de aula
//     selectHoraFinAula.append(optionFin)

//     // Agregar opciones para las solicitudes de máquina
//     selectHoraFinMaquina.append(optionFin.clone())
//   })

//   // Obtener la fecha actual
//   var currentDate = new Date()
//   // Crear una lista de los próximos 7 días hábiles
//   var datesList = []
//   while (datesList.length < 7) {
//     // Avanzar al siguiente día
//     currentDate.setDate(currentDate.getDate() + 1)
//     // Verificar si el día es hábil (de lunes a viernes)
//     if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
//       datesList.push(new Date(currentDate))
//     }
//   }
//   // Actualizar el select con las fechas
//   var selectFechaAula = $('#fecha')
//   var selectFechaMaquina = $('#fechaMaquina')

//   datesList.forEach(function (date) {
//     var year = date.getFullYear()
//     var month = ('0' + (date.getMonth() + 1)).slice(-2) // Se agrega 1 al mes ya que los meses son indexados desde 0
//     var day = ('0' + date.getDate()).slice(-2)
//     var formattedDate = year + '-' + month + '-' + day // Formato aceptable por MySQL (YYYY-MM-DD)
//     var formattedDateToShow = day + '-' + month + '-' + year
//     var option = $('<option></option>')
//     option.text(formattedDateToShow)
//     option.val(formattedDate)

//     // Agregar opciones para las solicitudes de aula
//     selectFechaAula.append(option)

//     // Agregar opciones para las solicitudes de máquina
//     selectFechaMaquina.append(option.clone())
//   })

//   let tipoDeUsuario = $('#usuario_actual').val()
//   console.log(tipoDeUsuario)

//   function GetSolicitudesPorUsuario () {
//     $.ajax({
//       type: 'POST',
//       url: 'controllers/aulas_controller.php',
//       data: JSON.stringify({
//         type: 'GetPorUsuario'
//       }),
//       dataType: 'json',
//       contentType: 'application/json',
//       success: function (response) {
//         console.log(response)

//         // Limpiar el contenido existente en el tbody
//         $('#ResultadoAulasSolicitadas').empty()

//         // Verificar si hay datos en la respuesta
//         if (response.data && response.data.length > 0) {
//           // Iterar sobre el array de objetos
//           response.data.forEach(function (solicitud) {
//             // Crear una fila de tabla para cada solicitud
//             var fila = $('<tr></tr>')

//             // Agregar cada valor como una celda de tabla
//             fila.append('<td>' + solicitud.id_solicitud + '</td>')
//             if (tipoDeUsuario == 4 || tipoDeUsuario == '4') {
//               fila.append(
//                 solicitud.tipo_solicitud
//                   ? '<td>' + solicitud.tipo_solicitud + '</td>'
//                   : '<td></td>'
//               )
//             }
//             fila.append('<td>' + solicitud.aula_solicitud + '</td>')
//             if (tipoDeUsuario == 4 || tipoDeUsuario == '4') {
//               fila.append(
//                 solicitud.maquina_solicitud
//                   ? '<td>' + solicitud.maquina_solicitud + '</td>'
//                   : '<td></td>'
//               )
//             }
//             fila.append('<td>' + solicitud.fecha_solicitud + '</td>')
//             fila.append(
//               '<td>' + solicitud.hora_inicio_solicitud.substring(0, 5) + '</td>'
//             )
//             fila.append(
//               '<td>' + solicitud.hora_fin_solicitud.substring(0, 5) + '</td>'
//             )
//             fila.append('<td>' + solicitud.estado_solicitud + '</td>')
//             fila.append('<td>' + solicitud.fecha_alta_solicitud + '</td>')

//             // Agregar la fila a la tabla
//             $('#ResultadoAulasSolicitadas').append(fila)
//           })
//         } else {
//           // Mostrar un mensaje si no hay datos
//           $('#ResultadoAulasSolicitadas').append(
//             '<tr><td colspan="9">No hay solicitudes disponibles.</td></tr>'
//           )
//         }
//       },
//       error: function (xhr, status, error) {
//         // Manejar errores si la solicitud no se completa correctamente
//         console.error('Error al obtener los datos de aulas solicitadas')
//       }
//     })
//   }

//   GetSolicitudesPorUsuario()

//   // Escuchar el envío del formulario
//   $('#formularioSolicitud').submit(function (event) {
//     // Prevenir el comportamiento predeterminado del formulario
//     event.preventDefault()

//     // Obtener los datos del formulario
//     var aula = $('#aula').val()
//     if (aula == 'Otro') {
//       aula = $('#otraAula').val()
//     }
//     var fecha = $('#fecha').val()
//     var horaInicio = $('#horaInicio').val() // Obtener la hora de inicio seleccionada
//     var horaFin = $('#horaFin').val() // Obtener la hora de fin seleccionada

//     // Validar que la hora de fin sea al menos 1 hora después de la hora de inicio
//     var horaInicioDate = new Date('2000-01-01 ' + horaInicio) // Asumimos que la fecha siempre es '2000-01-01' para simplificar
//     var horaFinDate = new Date('2000-01-01 ' + horaFin)
//     var diferenciaHoras = (horaFinDate - horaInicioDate) / (1000 * 60 * 60) // Diferencia en horas

//     if (diferenciaHoras < 1) {
//       // Mostrar SweetAlert2 indicando que la hora de fin debe ser al menos 1 hora después de la hora de inicio
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'La hora de fin debe ser al menos 1 hora después de la hora de inicio. Por favor, corrige esto.',
//         confirmButtonText: 'Aceptar'
//       })
//     } else {
//       // Realizar solicitud AJAX
//       $.ajax({
//         type: 'POST',
//         url: 'controllers/aulas_controller.php',
//         data: JSON.stringify({
//           type: 'Add',
//           aula: aula,
//           fecha: fecha,
//           horaInicio: horaInicio,
//           horaFin: horaFin,
//           tipoModal: 'Aula'
//         }),
//         dataType: 'json',
//         contentType: 'application/json',
//         success: function (response) {
//           console.log(response)

//           // Manejar la respuesta del servidor
//           if (!response.error) {
//             // Solicitud enviada correctamente
//             console.log('Solicitud de préstamo de aula enviada correctamente')
//             // Cerrar el modal después de enviar la solicitud
//             $('#modalSolicitud').modal('hide')
//             $('#formularioSolicitud')[0].reset() // Restablece el formulario
//             $('#modalSolicitud').on('hidden.bs.modal', function () {
//               $('.modal-backdrop').remove()
//             })
//           } else {
//             // Error al enviar la solicitud
//             console.error('Error al enviar la solicitud de préstamo de aula')
//             // Mostrar mensaje de error con SweetAlert2
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: response.data,
//               confirmButtonText: 'Aceptar'
//             })
//           }

//           GetSolicitudesPorUsuario()
//         },
//         error: function (xhr, status, error) {
//           // Manejar errores si la solicitud no se completa correctamente
//           console.error('Error al enviar la solicitud de préstamo de aula')
//           // Mostrar mensaje de error con SweetAlert2
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Error al enviar la solicitud de préstamo de aula. Por favor, inténtelo de nuevo.',
//             confirmButtonText: 'Aceptar'
//           })
//         }
//       })
//     }
//   })
//   // Escuchar el envío del formulario para máquina
//   $('#formularioSolicitudMaquina').submit(function (event) {
//     // Prevenir el comportamiento predeterminado del formulario
//     event.preventDefault()

//     // Obtener los datos del formulario
//     var fecha = $('#fechaMaquina').val()
//     var horaInicio = $('#horaInicioMaquina').val() // Obtener la hora de inicio seleccionada
//     var horaFin = $('#horaFinMaquina').val() // Obtener la hora de fin seleccionada

//     // Validar que la hora de fin sea al menos 1 hora después de la hora de inicio
//     var horaInicioDate = new Date('2000-01-01 ' + horaInicio) // Asumimos que la fecha siempre es '2000-01-01' para simplificar
//     var horaFinDate = new Date('2000-01-01 ' + horaFin)
//     var diferenciaHoras = (horaFinDate - horaInicioDate) / (1000 * 60 * 60) // Diferencia en horas

//     if (diferenciaHoras < 1) {
//       // Mostrar SweetAlert2 indicando que la hora de fin debe ser al menos 1 hora después de la hora de inicio
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'La hora de fin debe ser al menos 1 hora después de la hora de inicio. Por favor, corrige esto.',
//         confirmButtonText: 'Aceptar'
//       })
//     } else {
//       // Realizar solicitud AJAX
//       $.ajax({
//         type: 'POST',
//         url: 'controllers/aulas_controller.php',
//         data: JSON.stringify({
//           type: 'Add',
//           aula: '',
//           fecha: fecha,
//           horaInicio: horaInicio,
//           horaFin: horaFin,
//           tipoModal: 'Máquina'
//         }),
//         dataType: 'json',
//         contentType: 'application/json',
//         success: function (response) {
//           console.log(response)

//           // Manejar la respuesta del servidor
//           if (!response.error) {
//             // Solicitud enviada correctamente
//             console.log('Solicitud de préstamo de aula enviada correctamente')
//             // Cerrar el modal después de enviar la solicitud
//             $('#modalSolicitudMaquina').modal('hide')
//             $('#formularioSolicitudMaquina')[0].reset() // Restablece el formulario
//             $('#modalSolicitudMaquina').on('hidden.bs.modal', function () {
//               $('.modal-backdrop').remove()
//             })
//           } else {
//             // Error al enviar la solicitud
//             console.error('Error al enviar la solicitud de préstamo de máquina')
//             // Mostrar mensaje de error con SweetAlert2
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: response.data,
//               confirmButtonText: 'Aceptar'
//             })
//           }

//           GetSolicitudesPorUsuario()
//         },
//         error: function (xhr, status, error) {
//           // Manejar errores si la solicitud no se completa correctamente
//           console.error('Error al enviar la solicitud de préstamo de máquina')
//           // Mostrar mensaje de error con SweetAlert2
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Error al enviar la solicitud de préstamo de máquina. Por favor, inténtelo de nuevo.',
//             confirmButtonText: 'Aceptar'
//           })
//         }
//       })
//     }
//   })
// })
