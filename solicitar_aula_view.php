<link rel="stylesheet" href="css/solicitar_aula_view.css">

<div class="content">

    <div class="padder">

        <!-- Botón para abrir el modal -->
        <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalSolicitud">
            Solicitar préstamo de aula
        </button> -->
        <!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalSolicitudMaquina">
            Solicitar préstamo de máquina
        </button> -->

        <?php
        // Obtener el nombre del mes actual en español
        $meses = [
            1 => "enero",
            2 => "febrero",
            3 => "marzo",
            4 => "abril",
            5 => "mayo",
            6 => "junio",
            7 => "julio",
            8 => "agosto",
            9 => "septiembre",
            10 => "octubre",
            11 => "noviembre",
            12 => "diciembre"
        ];

        $mesActual = date('n'); // Obtiene el número del mes actual (1 a 12)
        $nombreMes = ucfirst($meses[$mesActual]); // Capitaliza la primera letra del mes
        ?>
        <div style="float: right;">
            <button id="historialAulas" class="p-3">Historial aulas</button>
        </div>
        <div class="row align-items-center">
            <h2 class="m-0 p-0">Calendario <?php echo $nombreMes ?></h2>
        </div>
        <div class="row align-items-center">
            <h6 class="col-6 text-left">Seleccione un día y horario presionando una opción disponible.</h6>
            <h6 class="col-6 text-right">
                Aula:
                <span class="badge badge-disponible">Disponible</span>
                <span class="badge badge-ocupada">Ocupada</span>
                <span class="badge badge-aprobada">Aprobada</span>
                <span class="badge badge-pendiente">Pendiente</span>
                <span class="badge badge-rechazada">Rechazada</span>
                <span class="badge badge-bloqueado">Fuera de horario</span>
            </h6>
        </div>




        <div class="table-overflow">
            <table class="table table-bordered">
                <thead id="headTablaSolicitudes">
                    <tr>
                        <th>Horario</th>
                        <!-- <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                        <th>Sábado</th> -->
                    </tr>
                </thead>
                <tbody id="ResultadoAulasSolicitadasView">
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="js/solicitar_aula.js"></script>

<!-- Modales -->
<div class="modal fade" id="modalSolicitud" tabindex="-1" role="dialog" aria-labelledby="modalSolicitudLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalSolicitudLabel">Solicitud de aula</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Formulario dentro del modal -->
                <form id="formularioSolicitud">

                    <div class="row">
                        <div class="col-md-6">
                            <!-- <div class="form-floating mb-3">
                                <input type="text" class="" id="aula" placeholder="" required value="Cuarto verde" disabled>
                                <label for="aula">Aula</label>
                            </div> -->
                            <div class="mb-3">
                                <label for="aula" class="form-label">Aula</label>
                                <input type="text" id="aula" class="" disabled>
                                <input type="text" id="idAula" class="" hidden>
                            </div>

                            <div class="mb-3">
                                <label for="capacidad" class="form-label">Capacidad de Aula:</label>
                                <input type="text" id="mcapacidadAula" class="" disabled>
                            </div>

                        </div>
                        <div class="col-md-6">
                            <!-- <div class="form-floating mb-3">
                                <input type="text" class="" id="fecha" placeholder="" required value="13-06-2024" disabled>
                                <label for="fecha">Fecha</label>
                            </div> -->
                            <div class="mb-3">
                                <label for="fecha" class="form-label">Fecha</label>
                                <input type="text" id="fecha" class="" disabled>
                            </div>

                            <div class="mb-3">
                                <label for="capacidad" class="form-label">Cupos tomados:</label>
                                <input type="text" id="mCupos" class="" disabled>
                            </div>

                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <!-- <div class="form-floating mb-3">
                                <input type="text" class="" id="horaInicio" placeholder="" required value="07:00" disabled>
                                <label for="horaInicio">Hora de inicio</label>
                            </div> -->
                            <div class="form-select-group mb-3">
                                <!-- <input type="text" id="horaInicio" class="" disabled>
                                <label for="horaInicio" class="form-label">Hora de inicio</label> -->
                                <label for="horaInicio" class="form-label">Hora de inicio</label>
                                <input type="text" id="horaInicio" class="" disabled>

                                <!-- <select id="horaInicio" class="" disabled> -->
                                <!-- Options will be dynamically added via JavaScript -->
                                <!-- </select> -->
                            </div>
                        </div>
                        <div class="col-md-6">
                            <!-- <div class="form-floating mb-3">
                                <input type="text" class="" id="horaFin" placeholder="" required value="09:00" disabled>
                                <label for="horaFin">Hora de fin</label>
                            </div> -->
                            <div class="form-select-group mb-3">
                                <!-- <input type="text" id="horaFin" class="" disabled>
                                <label for="horaFin" class="form-label">Hora de fin</label> -->
                                <label for="horaFin" class="form-label">Hora de fin</label>
                                <select id="horaFin"  disabled>
                                    <!-- Options will be dynamically added via JavaScript -->
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="hidden" class="" id="btnSendSolicitud" form="formularioSolicitud">Enviar solicitud</button>

            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalSolicitudMaquina" tabindex="-1" role="dialog" aria-labelledby="modalSolicitudLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalSolicitudLabel">Solicitud de máquina</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Formulario dentro del modal -->
                <form id="formularioSolicitudMaquina">

                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="fechaMaquina" class="form-label">Fecha</label>
                                <input type="text" id="fechaMaquina" class="" disabled>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-select-group mb-3">
                                <label for="horaInicioMaquina" class="form-label">Hora de inicio</label>
                                <input type="text" id="horaInicioMaquina" class="" disabled>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-select-group mb-3">
                                <label for="horaFinMaquina" class="form-label">Hora de fin</label>
                                <select id="horaFinMaquina" class="" disabled>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="hidden" class="" form="formularioSolicitudMaquina">Enviar Solicitud</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="modalHistorialAulas" tabindex="-1" role="dialog" aria-labelledby="modalHistorialAulasLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalHistorialAulasLabel">Historial de préstamos de aulas</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="historialAulasContainer">
                <!-- Aquí se añadirán dinámicamente las cards -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalHistorialMaquinas" tabindex="-1" role="dialog" aria-labelledby="modalHistorialMaquinasLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalHistorialMaquinasLabel">Historial de préstamos de máquinas</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="historialMaquinasContainer">
                <!-- Aquí se añadirán dinámicamente las cards -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>