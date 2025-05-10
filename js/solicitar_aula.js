$(document).ready(function () {

    var aulas = [];
    var historialAulas = [];

    function GetAulasPrestables() {
        $.ajax({
            type: 'POST',
            url: 'controllers/aulasConfig_controller.php',
            data: JSON.stringify({
                type: 'GetAulasPrestables'
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log('Respuesta del servidor:', response);
                if (response && !response.error) {
                    aulas = response.data.map(function (aula) {
                        return {
                            nombre: aula.NombreAula,
                            numero: aula.Capacidad,
                            id: aula.IdAula,
                            Capacidad: aula.Capacidad
                        };
                    });
                    console.log('Aulas prestables:', aulas);
                } else {
                    console.error('Error en la respuesta:', response.data);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener los datos de aulas solicitadas', error);
            }
        });
    }

    GetAulasPrestables();
    GetSolicitudesPorUsuarioInit();

    function GetSolicitudesPorUsuarioInit() {
        $.ajax({
            type: 'POST',
            url: 'controllers/aulas_controller.php',
            data: JSON.stringify({
                type: 'GetPorUsuario'
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {

                historialAulas = response.data;
                console.log("HISTORIAL DE AULAS" + historialAulas);
                if (!response.error) {
                }
            },
            error: function (xhr, status, error) {
            }
        });
    }


    // TODO traer los préstamos de la BD
    var prestamosPrueba = [
        { dia: 'Lunes', horaInicio: '07:00', horarioFin: '08:00', estado: 'pendiente', aula: 'ANIMA', numero: '210', fecha: '13-06-2024', tipo: 'Aula' },
        { dia: 'Martes', horaInicio: '07:30', horarioFin: '09:30', estado: 'ocupada', aula: 'MULTIM', numero: '212', fecha: '15-06-2024', tipo: 'Aula' }
    ];

    // TODO, aquí cambiamos los datos dummy por los datos desde el backend
    function GetAllSolicitudes() {
        $.ajax({
            type: 'POST',
            url: 'controllers/aulas_controller.php',
            data: JSON.stringify({
                type: 'Get'
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {

                if (!response.error) {
                    prestamosPrueba = response.data.map(item => ({
                        dia: obtenerNombreDia(item.fecha_solicitud),
                        horaInicio: item.hora_inicio_solicitud,
                        horarioFin: item.hora_fin_solicitud,
                        estado: item.estado_solicitud.toLowerCase(),
                        aula: item.aula_solicitud,
                        numero: item.numero_solicitud,
                        fecha: formatearFecha(item.fecha_solicitud),
                        creador: item.creador_solicitud,
                        tipo: item.tipo_solicitud
                    }));

                    // Actualiza los intervalos de los préstamos después de obtener los datos reales
                    intervalosPrestamos = dividirEnIntervalos(prestamosPrueba, 30);

                    actualizarTabla();

                } else {
                    // Error al enviar la solicitud
                    // console.error('Error al enviar la solicitud de préstamo de aula')
                    // Mostrar mensaje de error con SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data,
                        confirmButtonText: 'Aceptar'
                    })
                }

            }
        })
    }
    GetAllSolicitudes()

    function obtenerHorariosOcupados() {
        return $.ajax({
            type: 'POST',
            url: 'controllers/aulasConfig_controller.php',
            data: JSON.stringify({
                type: 'GetHorariosPrestamo'
            }),
            dataType: 'json',
            contentType: 'application/json'
        });
    }


    function obtenerFechasConfiguracion() {
        return $.ajax({
            type: 'POST',
            url: 'controllers/aulasConfig_controller.php',
            data: JSON.stringify({
                type: 'GetHorariosClases'
            }),
            dataType: 'json',
            contentType: 'application/json'
        });
    }



    function formatearFecha(fecha) {
        const partes = fecha.split('-');
        return partes[2] + '-' + partes[1] + '-' + partes[0];
    }

    function obtenerNombreDia(fecha) {
        // Crear un array con los nombres de los días en español
        const diasDeLaSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];

        // Convertir la cadena de fecha en un objeto Date
        const [year, month, day] = fecha.split('-');
        const fechaObjeto = new Date(year, month - 1, day); // Restar 1 al mes porque los meses en JavaScript son base 0

        // Obtener el día de la semana (0-6) con getDay()
        const diaDeLaSemana = fechaObjeto.getDay();

        // Retornar el nombre del día correspondiente
        return diasDeLaSemana[diaDeLaSemana];
    }

    function dividirEnIntervalos(prestamos, intervaloMinutos) {
        const intervalos = [];

        prestamos.forEach(prestamo => {
            const { dia, estado, aula, numero, creador, fecha, tipo } = prestamo;
            const horaInicio = convertirHoraAMinutos(prestamo.horaInicio);
            const horaFin = convertirHoraAMinutos(prestamo.horarioFin);

            for (let minuto = horaInicio; minuto < horaFin; minuto += intervaloMinutos) {
                const horaInicioIntervalo = convertirMinutosAHora(minuto);
                const horaFinIntervalo = convertirMinutosAHora(minuto + intervaloMinutos);

                intervalos.push({
                    dia,
                    horaInicio: horaInicioIntervalo,
                    horarioFin: horaFinIntervalo,
                    estado,
                    aula,
                    numero,
                    creador,
                    fecha,
                    tipo
                });
            }
        });
        // console.log(intervalos)
        return intervalos;
    }

    // Función para formatear la fecha en el formato deseado (ejemplo: '13-06-2024' a '2024-06-13')
    function formatearFecha(fecha) {
        // Aquí implementa la lógica para convertir '13-06-2024' a '2024-06-13'
        const partes = fecha.split('-');
        return partes[2] + '-' + partes[1] + '-' + partes[0];
    }

    function convertirHoraAMinutos(hora) {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    }

    function convertirMinutosAHora(minutos) {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }


    function generarHorarios() {
        var horarios = [];
        // for (var h = 7; h < 22; h++) {
        for (var h = 7; h < 22; h++) {
            for (var m = 0; m < 60; m += 30) {
                var hora = h < 10 ? '0' + h : h;
                var minuto = m < 10 ? '0' + m : m;
                horarios.push(hora + ':' + minuto);
            }
        }
        return horarios;
    }

    function obtenerEstado(dia, fecha, horaInicio, aulaNombre, aulaNumero) {
        var estructura = {
            estado: 'disponible',
            horaInicio: null,
            horaFin: null,
            creador: null,
            tipo: null
        };

        for (var i = 0; i < intervalosPrestamos.length; i++) {
            var prestamo = intervalosPrestamos[i];
            // if (prestamo.fecha === fecha) {
            //     console.log(prestamo.fecha)
            //     console.log(fecha)
            //     console.log(prestamo.fecha === fecha)
            // }
            if (prestamo.fecha === fecha && prestamo.horaInicio === horaInicio && (prestamo.aula == aulaNombre || prestamo.numero == aulaNumero)) {
                estructura.estado = prestamo.estado;
                estructura.horaInicio = prestamo.horaInicio;
                estructura.horaFin = prestamo.horarioFin;
                estructura.creador = prestamo.creador;
                estructura.tipo = prestamo.tipo;
                return estructura;
            }
        }
        return estructura;
    }


    var horariosList = generarHorarios();
    var tbody = $('#ResultadoAulasSolicitadasView');

    // Separamos el prestamosPrueba a horarios de 30 min
    var intervalosPrestamos = dividirEnIntervalos(prestamosPrueba, 30);

    // var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    function obtenerFechasDeLaSemana(diasExtra = 7) {
        const hoy = new Date();
        const diaSemana = hoy.getDay(); // 0 es domingo, 1 es lunes, ..., 6 es sábado
        const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        // Ajusta para que lunes sea el primer día
        const ajusteLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
        const diasConFechas = [];

        for (let i = 0; i < dias.length + diasExtra; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + ajusteLunes + i);
            const diaNumero = fecha.getDate();
            const mesNumero = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const añoNumero = fecha.getFullYear();
            const diaNombre = dias[i % dias.length];
            diasConFechas.push({
                nombre: diaNombre,
                fecha: `${diaNombre} ${diaNumero}-${mesNumero}-${añoNumero}`,
                fechaCorta: `${diaNumero}-${mesNumero}-${añoNumero}`,
                fechaDiaNumero: `${diaNombre} ${diaNumero}`,
            });
        }

        return diasConFechas;
    }

    const diasConFechas = obtenerFechasDeLaSemana();
    // console.log(diasConFechas)

    // Modificación para mostrar fechas en los encabezados
    $(diasConFechas).each(function (i) {
        $('#headTablaSolicitudes tr').append('<th>' + diasConFechas[i].fechaDiaNumero + '</th>');
    });

    function obtenerFechaHoyFormateada() {
        const hoy = new Date();
        const dia = hoy.getDate().toString().padStart(2, '0');
        const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base 0
        const año = hoy.getFullYear();
        return `${dia}-${mes}-${año}`;
    }


    var id_usuario_actual = $('#id_usuario_actual').val();


    function determinarEstado(horariosList, historialAulas, dia, horario, idAula) {
        const horarioInicioActual = convertirHoraAMinutos(horario);
        let fechaConvertida = dia.fechaCorta;

        if (/^\d{1}-/.test(fechaConvertida)) {
            fechaConvertida = `0${fechaConvertida}`; // Agrega un 0 al inicio si es necesario.
        }
        let estadoParaMostrar = "disponible";

        const registrosFiltrados = historialAulas.filter(horarioRegistrado => {
            const partes = horarioRegistrado.fecha_solicitud.split("-");
            const fechaRegistro = `${partes[2]}-${partes[1]}-${partes[0]}`;
            const horaInicioRegistrada = convertirHoraAMinutos(horarioRegistrado.fecha_hora_inicio);
            const horaFinRegistrada = convertirHoraAMinutos(horarioRegistrado.fecha_hora_fin);

            return (
                horarioRegistrado.ID_Aula === idAula &&
                fechaRegistro === fechaConvertida &&
                (horarioInicioActual >= horaInicioRegistrada && horarioInicioActual < horaFinRegistrada)
            );
        });

        if (registrosFiltrados.length > 0) {
            const registro = registrosFiltrados[0];
            switch (registro.estado_solicitud) {
                case "RECHAZADA":
                    estadoParaMostrar = "rechazada";
                    break;
                case "CONFIRMADO":
                    estadoParaMostrar = "aprobada";
                    break;
                case "APROBADA":
                    estadoParaMostrar = "aprobada";
                    break;
                case "PENDIENTE":
                    estadoParaMostrar = "pendiente";
                    break;
                case "OCUPADO":
                    estadoParaMostrar = "ocupado";
                    break;
            }
        }

        return estadoParaMostrar;
    }

    function actualizarTabla() {
        tbody.empty();
        const fechaHoy = obtenerFechaHoyFormateada();
        const fechaHoyValidacion = new Date();

        obtenerFechasConfiguracion().done(function (configData) {
            console.log(configData);
            const fechaInicioClases = configData.data.Fecha_InicioClases;
            const fechaFinClases = configData.data.Fecha_FinClases;

            const fechaInicio = normalizarFecha(new Date(fechaInicioClases));
            const fechaFin = normalizarFecha(new Date(fechaFinClases));
            const fechaActual = normalizarFecha(new Date(fechaHoyValidacion));

            obtenerHorariosOcupados().done(function (horariosOcupados) {
                const ocupados = horariosOcupados.data;

                horariosList.forEach(function (horario) {
                    var fila = $('<tr></tr>');
                    fila.append('<td>' + horario + '</td>');

                    diasConFechas.forEach(function (dia) {
                        var celda = $('<td class="time-slot"></td>');
                        aulas.forEach(function (aula) {
                            const idAula = aula.id;
                            const capacidad = aula.Capacidad;
                            const contenido = aula.nombre;

                            // Lógica para determinar el estado
                            let estadoParaMostrar = determinarEstado(horariosList, historialAulas, dia, horario, idAula);

                            // Validaciones adicionales
                            const horarioInicioActual = convertirHoraAMinutos(horario);
                            const horaActualRedondeada = obtenerHoraActualRedondeada();
                            let horarioEstaOcupado = false;

                             if (fechaActual <= fechaFin && fechaActual >= fechaInicio) {
                                ocupados.forEach(function (horarioOcupado) {
                                    const idAulaOcupada = horarioOcupado.IdAula;
                                    const diaOcupado = horarioOcupado.Dia;
                                    const horaInicioOcupada = convertirHoraAMinutos(horarioOcupado.HoraInicio);
                                    const horaFinOcupada = convertirHoraAMinutos(horarioOcupado.HoraFin);

                                    if (idAula === idAulaOcupada && dia.nombre.toUpperCase() === diaOcupado) {
                                        if (horarioInicioActual >= horaInicioOcupada && horarioInicioActual < horaFinOcupada) {
                                            horarioEstaOcupado = true;
                                        }
                                    }
                                });
                            }

                                if (horarioEstaOcupado) {
                                    estadoParaMostrar = 'ocupada';
                                }

                            if (esFechaPasada(dia.fechaCorta) && estadoParaMostrar === "disponible") {
                                estadoParaMostrar = "bloqueado";
                            } else if (dia.fechaCorta === fechaHoy &&
                                convertirHoraAMinutos(horario) < convertirHoraAMinutos(horaActualRedondeada) &&
                                estadoParaMostrar === "disponible") {
                                estadoParaMostrar = "bloqueado";
                            }

                            const partesFechaSemana = dia.fechaCorta.split("-");
                            const fecha = new Date(Date.UTC(partesFechaSemana[2], partesFechaSemana[1] - 1, partesFechaSemana[0]));
                            const diaSemana = fecha.getUTCDay();

                            if (diaSemana === 0 || diaSemana === 6) {
                                estadoParaMostrar = "bloqueado";
                            }

                            var div = $('<div class="' + estadoParaMostrar + '" title="' + estadoParaMostrar + '" fecha="' + dia.fechaCorta + '">' + contenido + '</div>');

                            div.on('click', function () {
                                if (estadoParaMostrar === "pendiente") {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: "Debes esperar a que la solicitud no esté pendiente",
                                        confirmButtonText: 'Aceptar'
                                        
                                    });
                                    return;
                                }

                                if (estadoParaMostrar === "aprobada") {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: "La solicitud ya ha sido aprobada o confirmada",
                                        confirmButtonText: 'Aceptar'
                                    });
                                    return;
                                }

                                if (estadoParaMostrar !== 'bloqueado' &&
                                    estadoParaMostrar !== 'ocupada' &&
                                    estadoParaMostrar !== "rechazada") {
                                    $('#aula').val(contenido);
                                    $('#idAula').val(idAula);
                                    var fechaSeleccionada = $(this).attr('fecha');
                                    $('#fecha').val(fechaSeleccionada);

                                    $('#horaInicio').val(horario);
                                    $('#mcapacidadAula').val(capacidad);

                                    var horaInicioMinutos = convertirHoraAMinutos(horario);
                                    var horaFinMaximaMinutos = horaInicioMinutos + 120;

                                    $('#horaFin').prop('disabled', false).empty();
                                    var opcionesHoraFin = horariosList.filter(h => {
                                        var minutos = convertirHoraAMinutos(h);
                                        return minutos > horaInicioMinutos && minutos <= horaFinMaximaMinutos;
                                    });

                                    opcionesHoraFin.forEach(function (hora) {
                                        $('#horaFin').append($('<option>', {
                                            value: hora,
                                            text: hora
                                        }));
                                    });

                                    if (horario >= '20:00') {
                                        $('#horaFin').append($('<option>', {
                                            value: '22:00',
                                            text: '22:00'
                                        }));
                                    }

                                    var partesFecha = fechaSeleccionada.split('-');
                                    var fechaFormateada = partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0];

                                    var horaFinSeleccionada = $('#horaFin').val();
                                    var fechaHoraFin = `${fechaFormateada} ${horaFinSeleccionada}:00`;

                                    $.ajax({
                                        type: 'POST',
                                        url: 'controllers/aulas_controller.php',
                                        data: JSON.stringify({
                                            type: 'GetCountSolicitudes',
                                            id_aula: idAula,
                                            fecha: fechaFormateada,
                                            hora_inicio: `${fechaFormateada} ${horario}:00`,
                                            hora_fin: fechaHoraFin
                                        }),
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (response) {
                                            if (!response.error) {
                                                $('#mCupos').val(response.data.TotalSolicitudes);
                                                if (response.data.TotalSolicitudes === "") {
                                                    $('#mCupos').val = 0;
                                                }

                                                //if (response.data.TotalSolicitudes >= capacidad) {
                                                  //  $('#btnSendSolicitud').prop('disabled', true); 
                                                //} else {
                                                  //  $('#btnSendSolicitud').prop('disabled', false);  
                                                //}

                                            } else {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: response.data,
                                                    confirmButtonText: 'Aceptar'
                                                });
                                            }
                                        },
                                        error: function () {
                                            console.error('Error al obtener el conteo de solicitudes.');
                                        }
                                    });

                                    $('#modalSolicitud').modal('show');
                                }
                            });

                            celda.append(div);
                        });
                        fila.append(celda);
                    });

                    tbody.append(fila);
                });
            });
        }).fail(function () {
            console.error('Error al obtener las fechas de configuración.');
        });
    }



    function obtenerHoraActualRedondeada() {
        const ahora = new Date();
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();

        // Redondear a la media hora más cercana
        if (minutos < 30) {
            minutos = 0;
        } else {
            minutos = 30;
        }

        // Crear una nueva fecha con los minutos redondeados
        const horaRedondeada = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), horas, minutos);

        // Agregar 30 minutos adicionales
        horaRedondeada.setMinutes(horaRedondeada.getMinutes() + 30);

        // Formatear horas y minutos
        const horasFormateadas = horaRedondeada.getHours().toString().padStart(2, '0');
        const minutosFormateados = horaRedondeada.getMinutes().toString().padStart(2, '0');
        return `${horasFormateadas}:${minutosFormateados}`;
    }

    function esFechaPasada(fechaStr) {
        const ahora = new Date();
        const [dia, mes, año] = fechaStr.split('-').map(Number);
        const fecha = new Date(año, mes - 1, dia); // Restar 1 al mes porque los meses en JavaScript son base 0

        // Comparar solo las fechas (ignorar horas)
        return fecha < new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    }


    function normalizarFecha(fecha) {
        return new Date(fecha.setHours(0, 0, 0, 0));  // Ajusta la fecha a las 00:00:00.000
    }


    $('#formularioSolicitud').submit(function (event) {
        // Prevenir el comportamiento predeterminado del formulario
        event.preventDefault()

        // Obtener los datos del formulario
        var aula = $('#aula').val();
        // Eliminar lo que esté dentro de paréntesis y los paréntesis
        aula = aula.replace(/\s*\(.*?\)\s*/g, '');


        var id = $('#idAula').val();


        var fecha = $('#fecha').val(); // Fecha en formato dd-mm-yyyy
        var partes = fecha.split('-'); // Divide la fecha en partes (día, mes, año)
        var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0]; // Reorganiza las partes en el formato yyyy-mm-dd

        var horaInicio = $('#horaInicio').val() // Obtener la hora de inicio seleccionada
        var horaFin = $('#horaFin').val() // Obtener la hora de fin seleccionada

        // Validar que la hora de fin sea al menos 1 hora después de la hora de inicio
        var horaInicioDate = new Date('2000-01-01 ' + horaInicio) // Asumimos que la fecha siempre es '2000-01-01' para simplificar
        var horaFinDate = new Date('2000-01-01 ' + horaFin)
        var diferenciaHoras = (horaFinDate - horaInicioDate) / (1000 * 60 * 60) // Diferencia en horas

        // Separar la fecha en partes (día, mes, año)
        var partesFecha = fecha.split('-'); // Divide la fecha en día, mes, año
        var dia = partesFecha[0]; // Día
        var mes = partesFecha[1]; // Mes
        var año = partesFecha[2]; // Año

        var fechaFormateada = `${año}-${mes}-${dia}`;

        var fechaInicioString = `${fechaFormateada} ${horaInicio}:00`;
        var fechaFinString = `${fechaFormateada} ${horaFin}:00`;


        $('#idAula').css('display', 'none');




        if (diferenciaHoras < 0.5) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La hora de fin debe ser al menos 30 min después de la hora de inicio. Por favor, corrige esto.',
                confirmButtonText: 'Aceptar'
            })
        } else if (diferenciaHoras > 2) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La hora de fin debe ser como máximo 2 horas después de la hora de inicio. Por favor, corrige esto.',
                confirmButtonText: 'Aceptar'
            })
        } else {
            $.ajax({
                type: 'POST',
                url: 'controllers/aulas_controller.php',
                data: JSON.stringify({
                    type: 'Add',
                    id: id,
                    aula: aula,
                    fecha: fechaFormateada,
                    horaInicio: fechaInicioString,
                    horaFin: fechaFinString,
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    if (!response.error) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Solicitud enviada',
                            text: "Se ha realizado la operación con éxito",
                            confirmButtonText: 'Aceptar'
                        })
                        $('#modalSolicitud').modal('hide')
                        $('#formularioSolicitud')[0].reset() // Restablece el formulario
                        $('#modalSolicitud').on('hidden.bs.modal', function () {
                            $('.modal-backdrop').remove()
                            GetAllSolicitudes();
                        })
                    } else {
                        console.error('Error al enviar la solicitud de préstamo de aula')
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data,
                            confirmButtonText: 'Aceptar'
                        })
                    }

                    GetAllSolicitudes()
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data,
                        confirmButtonText: 'Aceptar'
                    })
                }
            })
        }
    })
    $('#formularioSolicitudMaquina').submit(function (event) {
        // Prevenir el comportamiento predeterminado del formulario
        event.preventDefault()

        var fecha = $('#fechaMaquina').val(); // Fecha en formato dd-mm-yyyy
        var partes = fecha.split('-'); // Divide la fecha en partes (día, mes, año)
        var fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0]; // Reorganiza las partes en el formato yyyy-mm-dd

        var horaInicio = $('#horaInicioMaquina').val() // Obtener la hora de inicio seleccionada
        var horaFin = $('#horaFinMaquina').val() // Obtener la hora de fin seleccionada

        // Validar que la hora de fin sea al menos 1 hora después de la hora de inicio
        var horaInicioDate = new Date('2000-01-01 ' + horaInicio) // Asumimos que la fecha siempre es '2000-01-01' para simplificar
        var horaFinDate = new Date('2000-01-01 ' + horaFin)
        var diferenciaHoras = (horaFinDate - horaInicioDate) / (1000 * 60 * 60) // Diferencia en horas
        // console.log(diferenciaHoras)
        if (diferenciaHoras < 0.5) {
            // Mostrar SweetAlert2 indicando que la hora de fin debe ser al menos 30 min después de la hora de inicio
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La hora de fin debe ser al menos 30 min después de la hora de inicio. Por favor, corrige esto.',
                confirmButtonText: 'Aceptar'
            })
        } else if (diferenciaHoras > 2) {
            // Mostrar SweetAlert2 indicando que la hora de fin debe ser como máximo 2 horas después de la hora de inicio
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La hora de fin debe ser como máximo 2 horas después de la hora de inicio. Por favor, corrige esto.',
                confirmButtonText: 'Aceptar'
            })
        } else {
            // console.log('pasó')
            // Realizar solicitud AJAX
            $.ajax({
                type: 'POST',
                url: 'controllers/aulas_controller.php',
                data: JSON.stringify({
                    type: 'Add',
                    aula: '',
                    fecha: fechaFormateada,
                    horaInicio: horaInicio,
                    horaFin: horaFin,
                    tipoModal: 'Máquina'
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    if (!response.error) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Solicitud enviada',
                            text: response.data,
                            confirmButtonText: 'Aceptar'
                        })
                        $('#modalSolicitudMaquina').modal('hide')
                        $('#formularioSolicitudMaquina')[0].reset()
                        $('#modalSolicitudMaquina').on('hidden.bs.modal', function () {
                            $('.modal-backdrop').remove()
                        })
                    } else {
                        console.error('Error al enviar la solicitud de préstamo de aula')
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data,
                            confirmButtonText: 'Aceptar'
                        })
                    }

                    GetAllSolicitudes()
                },
                error: function (xhr, status, error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al enviar la solicitud de préstamo de aula. Por favor, inténtelo de nuevo.',
                        confirmButtonText: 'Aceptar'
                    })
                }
            })
        }
    })

    // Cuando se hace clic en el botón "Historial aulas"
    $('#historialAulas').click(function () {
        var cardsmostradas = 0;

        function GetSolicitudesPorUsuario() {
            $.ajax({
                type: 'POST',
                url: 'controllers/aulas_controller.php',
                data: JSON.stringify({
                    type: 'GetPorUsuario'
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {

                    historialAulas = response.data;
                    console.log("HISTORIAL DE AULAS:" + historialAulas);

                    if (!response.error) {
                        var container = $('#historialAulasContainer');
                        container.empty(); // Limpiar el contenedor antes de añadir nuevas cards
                        if (response.data.length > 0) {
                            // Recorrer los datos de las solicitudes y crear las cards
                            response.data.forEach(function (solicitud) {
                                var estadoClass = getPrestamoEstadoClass(solicitud.estado_solicitud);

                                cardsmostradas++;
                                var card = $('<div class="card ' + estadoClass + ' mb-1"></div>');
                                var cardBody = $('<div class="card-body"></div>');

                                var nombreAula = $('<h5 class="card-title">' + solicitud.nombre_aula + '</h5>');

                                var fechaAlta = $('<p class="card-text">Fecha de alta: ' + solicitud.fecha_alta_solicitud + '</p>');

                                var fechaSolicitud = $('<p class="card-text">Fecha de solicitud: ' + solicitud.fecha_solicitud + '</p>');

                                var estado = $('<p class="card-text">Estado: ' + solicitud.estado_solicitud + '</p>');

                                cardBody.append(nombreAula, fechaSolicitud, estado, fechaAlta);
                                card.append(cardBody);

                                container.append(card);
                            });

                            if (cardsmostradas === 0) {
                                var card = $('<div class="card mb-1"></div>');
                                var cardBody = $('<div class="card-body"></div>');
                                var mensaje = $('<p class="card-text">No hay solicitudes vigentes.</p>');
                                cardBody.append(mensaje);
                                card.append(cardBody);
                                container.append(card);
                            }
                        } else {
                            var card = $('<div class="card mb-1"></div>');
                            var cardBody = $('<div class="card-body"></div>');
                            var mensaje = $('<p class="card-text">No existen solicitudes vigentes.</p>');
                            cardBody.append(mensaje);
                            card.append(cardBody);
                            container.append(card);
                        }

                        $('#modalHistorialAulas').modal('show');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data,
                            confirmButtonText: 'Aceptar'
                        });
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error en la solicitud AJAX',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }


        // TODO: MAS COLORES Y SABER QUE CLASES SON LAS DE GRIS


        function getPrestamoEstadoClass(estado) {
            if (typeof estado === 'string') {
                switch (estado.toLowerCase()) {
                    case 'pendiente':
                        return 'bg-pendiente';
                    case 'aprobada':
                        return 'bg-aprobada';
                    case 'rechazada':
                        return 'bg-rechazada';
                    case 'cerrado':
                        return 'bg-aprobada';
                    case 'confirmado':
                        return 'bg-aprobada';
                    default:
                        return '';
                }
            }
            return '';
        }

        // Llamar a la función para obtener las solicitudes por usuario
        GetSolicitudesPorUsuario();
    });

    // Cuando se hace clic en el botón "Historial aulas"
    $('#historialMaquinas').click(function () {
        var cardsmostradas = 0;
        function GetSolicitudesPorUsuario() {
            $.ajax({
                type: 'POST',
                url: 'controllers/aulas_controller.php',
                data: JSON.stringify({
                    type: 'GetPorUsuario'
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {

                    if (!response.error) {
                        var container = $('#historialMaquinasContainer');
                        container.empty();


                        if (response.data.length > 0) {
                            response.data.forEach(function (prestamo) {
                                var estadoClass = getPrestamoEstadoClass(prestamo.estado_solicitud);

                                // Función para formatear la fecha como dd-mm-yyyy
                                function formatDate(dateString) {
                                    var dateObj = new Date(dateString);
                                    var day = dateObj.getDate();
                                    var month = dateObj.getMonth() + 1; // Los meses van de 0 a 11
                                    var year = dateObj.getFullYear();

                                    // Agregar ceros a la izquierda si es necesario
                                    if (day < 10) {
                                        day = '0' + day;
                                    }
                                    if (month < 10) {
                                        month = '0' + month;
                                    }

                                    return day + '-' + month + '-' + year;
                                }

                                // Función para formatear la hora como hh:mm
                                function formatTime(timeString) {
                                    var time = timeString.split(':');
                                    var hours = time[0];
                                    var minutes = time[1];

                                    return hours + ':' + minutes;
                                }

                                // Función para formatear la fecha y hora como dd-mm-yyyy hh:mm
                                function formatDateTime(dateTimeString) {
                                    var dateTime = new Date(dateTimeString);
                                    var day = dateTime.getDate();
                                    var month = dateTime.getMonth() + 1; // Los meses van de 0 a 11
                                    var year = dateTime.getFullYear();
                                    var hours = dateTime.getHours();
                                    var minutes = dateTime.getMinutes();

                                    // Agregar ceros a la izquierda si es necesario
                                    if (day < 10) {
                                        day = '0' + day;
                                    }
                                    if (month < 10) {
                                        month = '0' + month;
                                    }
                                    if (hours < 10) {
                                        hours = '0' + hours;
                                    }
                                    if (minutes < 10) {
                                        minutes = '0' + minutes;
                                    }

                                    return hours + ':' + minutes + ' del día ' + day + '-' + month + '-' + year;
                                }

                                if (prestamo.tipo_solicitud === 'Máquina') {
                                    cardsmostradas++;
                                    // Crear la card
                                    var card = $('<div class="card ' + estadoClass + ' mb-1"></div>');
                                    var cardBody = $('<div class="card-body"></div>');
                                    var nombreDelAula = (prestamo.aula_solicitud != '') ? prestamo.aula_solicitud : '[Aula pendiente de asignar]';
                                    var nombreAula = $('<h5 class="card-title">' + nombreDelAula + '</h5>');
                                    var fecha = $('<p class="card-text">Fecha de solicitud: ' + formatDateTime(prestamo.fecha_alta_solicitud) + '</p>');
                                    var horario = $('<p class="card-text">Horario: ' + formatTime(prestamo.hora_inicio_solicitud) + ' - ' + formatTime(prestamo.hora_fin_solicitud) + ' el día ' + formatDate(prestamo.fecha_solicitud) + '</p>');
                                    var estado = $('<p class="card-text">Estado: ' + prestamo.estado_solicitud + '</p>');

                                    // Añadir el contenido a la card
                                    cardBody.append(nombreAula, nombreMaquina, horario, estado, fecha);
                                    card.append(cardBody);

                                    // Añadir la card al contenedor
                                    container.append(card);
                                }
                            });

                            if (cardsmostradas == 0) {
                                // Crear la card
                                var card = $('<div class="card mb-1"></div>');
                                var cardBody = $('<div class="card-body"></div>');
                                var mensaje = $('<p class="card-text">No hay préstamos vigentes.</p>');
                                // Añadir el contenido a la card
                                cardBody.append(mensaje);
                                card.append(cardBody);

                                // Añadir la card al contenedor
                                container.append(card);
                            }
                        } else {
                            // Crear la card
                            var card = $('<div class="card mb-1"></div>');
                            var cardBody = $('<div class="card-body"></div>');
                            var mensaje = $('<p class="card-text">No existen préstamos vigentes.</p>');
                            // Añadir el contenido a la card
                            cardBody.append(mensaje);
                            card.append(cardBody);

                            // Añadir la card al contenedor
                            container.append(card);
                        }

                        // Mostrar el modal correspondiente
                        $('#modalHistorialMaquinas').modal('show');

                    } else {
                        // Error al enviar la solicitud
                        // console.error('Error al enviar la solicitud de préstamo de aula');
                        // Mostrar mensaje de error con SweetAlert2
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data,
                            confirmButtonText: 'Aceptar'
                        });
                    }
                },
                error: function (xhr, status, error) {
                    // console.error('Error en la solicitud AJAX:', error);
                    // Mostrar mensaje de error con SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error en la solicitud AJAX',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }

        function getPrestamoEstadoClass(estado) {
            if (typeof estado === 'string') {
                switch (estado.toLowerCase()) {
                    case 'PENDIENTE':
                        return 'bg-pendiente';
                    case 'RECHAZADA':
                        return 'bg-rechazada';
                    case 'APROBADA':
                        return 'bg-aprobada';
                    default:
                        return '';
                }
            } else {
                return '';
            }
        }


        GetSolicitudesPorUsuario();
    });



    function formatearFechaHora(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        var seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


});
