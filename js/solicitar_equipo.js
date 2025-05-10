$(document).ready(function () {


    let equipos = [];


    async function GetEquiposPrestables() {
        try {
            const response = await $.ajax({
                type: 'POST',
                url: 'controllers/equipoConfig_controller.php',
                data: JSON.stringify({ type: 'Get' }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    console.log('Respuesta del servidor:', response);
                    if (response && !response.error) {
                        equipos = response.data.map(function (equipo) {
                            return { nombre: equipo.nombre, id: equipo.id };
                        });
                    } else {
                        console.error('Error en la respuesta:', response.data);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error al obtener los datos de equipos solicitados', error);
                }
            });
        } catch (error) {
            console.error("Error en GetEquiposPrestables:", error);
        }
    }
    obtenerPedidosUsuario();

    function obtenerPedidosUsuario() {
        $.ajax({
            type: 'POST',
            url: 'controllers/equipos_controller.php',
            data: JSON.stringify({
                type: 'GetPorUsuario'
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log('Respuesta del servidor:', response);
                if (response && !response.error) {
                    procesarPedidos(response.data);
                } else {
                    console.error('Error en la respuesta:', response.data);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener los datos de pedidos de equipos del usuario', error);
            }
        });
    }

    $('#solicitarEquipoBtn').on('click', async function () {
        await solicitarEquipo();
    });

    function procesarPedidos(pedidos) {
        const solicitudesPendientes = pedidos.filter(p => p.estatus === 'PENDIENTE' || p.estatus === 'APROBADA' || p.estatus === 'CONFIRMADO');
        const solicitudesPasadas = pedidos.filter(p => p.estatus === 'RECHAZADA' || p.estatus === 'CERRADO');

        llenarTabla(solicitudesPendientes, '#tablaSolicitudesPendientes');
        llenarTabla(solicitudesPasadas, '#tablaSolicitudesAceptadas');
    }

    function llenarTabla(pedidos, tablaSelector) {
        const tbody = $(tablaSelector).find('tbody');
        tbody.empty();

        pedidos.forEach(pedido => {
            const row = $('<tr></tr>');
            const color = obtenerColorEstatus(pedido.estatus);

            row.append($('<td></td>').text(pedido.numero_pedido));
            row.append($('<td></td>').text(pedido.nombreEquipo));
            row.append($('<td></td>').text(pedido.estatus).css('background-color', color));
            row.append($('<td></td>').text(pedido.fecha_inicio));
            row.append($('<td></td>').text(pedido.fecha_fin));
            row.append($('<td></td>').text(pedido.fecha_alta));

            tbody.append(row);
        });
    }


    function obtenerColorEstatus(estatus) {
        switch (estatus) {
            case 'RECHAZADA':
                return '#920c0c';
            case 'PENDIENTE':
                return '#c48002';
            case 'APROBADA':
                return '#18792e';
            case 'CONFIRMADO':
                return '#18792e';
            case 'CERRADO':
                return '#858585';
            default:
                return '#858585';
        }
    }

    async function solicitarEquipo() {

        await GetEquiposPrestables();


        if (!equipos || equipos.length === 0) {
            Swal.fire('Error', 'No se han cargado equipos disponibles.', 'error');
            return;
        }


        const horas = [
            "09:00", "09:30", "10:00", "10:30", "11:00",
            "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
            "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
        ];

        const { value: formValues } = await Swal.fire({
            title: 'Solicitar Equipo',
            html: `
            <label for="equipoSelect">Selecciona un equipo:</label>
            <select id="equipoSelect" class="swal2-input">
                ${equipos.map(equipo => `<option value="${equipo.id}">${equipo.nombre}</option>`).join('')}
            </select>
            <label for="fechaInicio">Selecciona la fecha de inicio:</label>
            <input id="fechaInicio" type="date" class="swal2-input" min="${getMinDate()}" max="${getMaxDate()}">
            <label for="horaInicioE">Selecciona la hora de inicio:</label>
            <select id="horaInicioE" class="swal2-input">
                ${horas.map(hora => `<option value="${hora}">${hora}</option>`).join('')}
            </select>
            <label for="horaFinE">Selecciona la hora de fin:</label>
            <select id="horaFinE" class="swal2-input">
                ${horas.map(hora => `<option value="${hora}">${hora}</option>`).join('')}
            </select>
        `,
            showCancelButton: true,
            confirmButtonText: 'Solicitar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const equipoId = document.getElementById('equipoSelect').value;
                const fechaInicio = document.getElementById('fechaInicio').value;
                const horaInicio = document.getElementById('horaInicioE').value;
                const horaFin = document.getElementById('horaFinE').value;


                const fechaSeleccionada = new Date(fechaInicio);
                const diaSemana = fechaSeleccionada.getDay(); 
                if (diaSemana === 5 || diaSemana === 6) {
                    Swal.showValidationMessage('Los equipos no se pueden prestar los sábados ni domingos.');
                    return false;
                }

                if (!fechaInicio || !horaInicio || !horaFin) {
                    Swal.showValidationMessage('Por favor, complete todos los campos.');
                    return false;
                }

                const hoy = new Date().toISOString().split("T")[0];
                if (fechaInicio <= hoy) {
                    Swal.showValidationMessage('La fecha de inicio debe ser a partir de mañana.');
                    return false;
                }

                const inicio = new Date(`2000-01-01T${horaInicio}:00`);
                const fin = new Date(`2000-01-01T${horaFin}:00`);

                if (inicio >= fin) {
                    Swal.showValidationMessage('La hora de inicio debe ser anterior a la hora de fin.');
                    return false;
                }

                const diffMinutes = getTimeDifference(horaInicio, horaFin);
                if (diffMinutes > 120) {
                    Swal.showValidationMessage('El periodo no puede exceder 2 horas.');
                    return false;
                }

                return { equipoId, fechaInicio, horaInicio, horaFin };
            }
        });

        if (formValues) {
            $.ajax({
                type: 'POST',
                url: 'controllers/equipos_controller.php',
                data: JSON.stringify({
                    type: 'Add',
                    id: formValues.equipoId,
                    horaInicio: `${formValues.fechaInicio} ${formValues.horaInicio}:00`,
                    horaFin: `${formValues.fechaInicio} ${formValues.horaFin}:00`,
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    if (response && !response.error) {
                        Swal.fire('Solicitud enviada', 'Tu solicitud de equipo ha sido enviada correctamente.', 'success');
                        obtenerPedidosUsuario();
                    } else {
                        Swal.fire('Error', response.data || 'No se pudo enviar la solicitud.', 'error');
                    }
                },
                error: function (xhr, status, error) {
                    Swal.fire('Error', 'Hubo un problema al enviar la solicitud.', 'error');
                }
            });
        }
    }

    function getMinDate() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate());
        return fecha.toISOString().split("T")[0];
    }

    function getMaxDate() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 7);
        return fecha.toISOString().split("T")[0];
    }

    function getTimeDifference(horaInicio, horaFin) {
        const [h1, m1] = horaInicio.split(':').map(Number);
        const [h2, m2] = horaFin.split(':').map(Number);
        return (h2 * 60 + m2) - (h1 * 60 + m1);
    }



});
