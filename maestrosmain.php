<?php
date_default_timezone_set("America/Mexico_City");
session_start();

if (isset($_SESSION["user"])) {
    if ($_SESSION["user"]["PerfilId"] == 1) {
        header('Location: main.php');
    } else if ($_SESSION["user"]["PerfilId"] == 2) {
        // header('Location: maestrosmain.php');
    } else if ($_SESSION["user"]["PerfilId"] == 5) {
        // Incluir tu archivo JavaScript
        echo '<script src="js/ticketsPerfil5.js"></script>';
    }
} else {
    header('Location: index.php');
}




// VALIDACIONES CORREO 
$message = "";
$formatoAntiguo = '/^[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/';
$formatoActual = '/^[a-zA-Z0-9_\.+]+(\.)+[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/';

$input = $_SESSION["user"]["Correo"];

function alerta_correcto($msg)
{
    echo "<script type='text/javascript'>alert('$msg');</script>";
}

function alerta_incorrecto($msg)
{
    echo "<script type='text/javascript'>alert('$msg');</script>";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="http://www.fcfm.uanl.mx/sites/all/themes/temaFCFM/img/fcfm.ico"
        type="image/vnd.microsoft.icon">
    <link rel="stylesheet" href="fonts/icomoon/style.css">
    <link rel="stylesheet" href="grid.css">
    <title>ADMINISTRACIÓN</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Incluir los archivos de Bootstrap -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="style.css">

</head>

<body>
    <input type="hidden" name="id_usuario_actual" id="id_usuario_actual" value="<?php echo $_SESSION["user"]["Id"]; ?>">

    <div id="wrapper" class="main-wrapper theme09">
        <input type="hidden" class="form-control mt-2" id="usuario_actual" name="usuario_actual" value="2">


        <?php if (strlen(trim($_SESSION["user"]["Correo"])) <= 0) { ?>
            <x-modal active="true" canclose="true" size="sm">
                <div slot="title">PERFIL</div>
                <div class="padder">Recuerda introducir tu correo, en el apartado PERFIL del menu lateral</div>
                <div class="padder">Hasta que no ingrese su correo no aparecera la información</div>
                <button slot="footer" autofocus class="close">Cerrar</button>
            </x-modal>
        <?php } ?>
        <x-modal id="MiPerfil" canclose="true" size="sm">
            <p slot="title">PERFIL</p>
            <x-tab class="negative">
                <div slot="items" class="tab-item wave wave-black" ref="MiCorreo">CORREO</div>
                <div slot="items" class="tab-item wave wave-black" ref="MiContraseña">CONTRASEÑA</div>
                <div slot="tabs" id="MiCorreo" class="container">
                    <div class="content">
                        <div class="padder">
                            <div class="igrid-sm-2">
                                <label for="correo">Correo</label>
                                <div class="inpt-wrapper">
                                    <input id="correo" name="correo" type="text"
                                        value="<?= trim($_SESSION["user"]["Correo"]) ?>" placeholder="Correo...">
                                    <!-- <label for="contraseña">El formato de correo debe ser el siguiente: nombre.apellido@uanl.edu.mx </label> -->
                                    <div class="inpt-under"></div>

                                </div>

                            </div>
                            <div class="igrid-m-4">
                                <label for="contraseña">El formato de correo debe ser el siguiente:
                                    nombre.apellido@uanl.edu.mx </label>
                            </div>
                            <button id="GuardarMiCorreo">Guardar</button>
                        </div>
                    </div>
                </div>
                <div slot="tabs" id="MiContraseña" class="container">
                    <div class="content">
                        <div class="padder">
                            <div class="igrid-sm-2">
                                <label for="contraseña">Contraseña</label>
                                <div class="inpt-wrapper">
                                    <input id="contraseña" name="contraseña" type="password"
                                        placeholder="Contraseña...">
                                    <div class="inpt-under"></div>
                                </div>
                            </div>
                            <button id="GuardarMiContraseña">Guardar</button>
                        </div>
                    </div>
                </div>
            </x-tab>
            <button class="close" autofocus slot="footer">CERRAR</button>
        </x-modal>
        <div class="main-container">
            <div class="main-header">
                <div>
                    <span id="toggle-menu" class="icon-menu"></span>
                    SISTEMA DE REGISTRO
                </div>
            </div>
            <div class="main-body">

                <x-menu id="menu">
                    <div slot="header">Bienvenido Maestro <?= $_SESSION["user"]["Nombre"] ?></div>
                    <div slot="footer"></div>
                    <div id="logout" class="menu-option wave">CERRAR SESIÓN</div>
                    <div id="perfil" class="menu-option wave">PERFIL</div>
                </x-menu>

                <div class="main-content">
                    <x-tab main>
                        <?php if (preg_match($formatoAntiguo, $input) || preg_match($formatoActual, $input)) { ?>
                            <div slot="items" class="tab-item wave" ref="Grupos">GRUPOS</div>
                            <div slot="items" class="tab-item wave" ref="AlumnoGrupos">ALUMNOS INSCRITOS</div>
                            <div slot="items" class="tab-item wave" ref="Tickets">TICKETS</div>
                            <div slot="items" class="tab-item wave" ref="SolicitarAula">SOLICITAR AULA</div>
                            <div slot="items" class="tab-item wave" ref="SolicitarEquipo">SOLICITAR EQUIPO</div>

                            <div slot="tabs" id="Grupos" class="container">
                                <div class="content">
                                    <x-modal id="ModalGrupo" size="md" canclose="true">
                                        <div slot="title"></div>
                                        <div class="padder">
                                            <form autocomplete="off">
                                                <input id="mgaid" type="hidden">
                                                <input id="minscritos" type="hidden">
                                                <div class="igrid-sm-2">
                                                    <label for="mgmmateria">Materia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmmateria" name="mgmmateria">
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="mgmnombre">Nombre</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgmnombre" type="text" name="mgmnombre"
                                                            placeholder="Nombre..." disabled="true">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgmdia">Dia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmdia" name="mgmdia">
                                                            <option value="LU">LUNES</option>
                                                            <option value="MA">MARTES</option>
                                                            <option value="MI">MIÉRCOLES</option>
                                                            <option value="JU">JUEVES</option>
                                                            <option value="VI">VIERNES</option>
                                                            <option value="SA">SÁBADO</option>
                                                            <option value="DO">DOMINGO</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="mgmhorainicio">Hora inicio</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmhorainicio" name="mgmhorainicio">
                                                            <option value="0700" selected>M01 - 07:00 am - 07:30 am</option>
                                                            <option value="0730">M02 - 07:30 am - 08:00 am</option>
                                                            <option value="0800">M03 - 08:00 am - 08:30 am</option>
                                                            <option value="0830">M04 - 08:30 am - 09:00 am</option>
                                                            <option value="0900">M05 - 09:00 am - 09:30 am</option>
                                                            <option value="0930">M06 - 09:30 am - 10:00 am</option>
                                                            <option value="1000">M07 - 10:00 am - 10:30 am</option>
                                                            <option value="1030">M08 - 10:30 am - 11:00 am</option>
                                                            <option value="1100">M09 - 11:00 am - 11:30 am</option>
                                                            <option value="1130">M10 - 11:30 am - 12:00 pm</option>
                                                            <option value="1200">V01 - 12:00 pm - 12:30 pm</option>
                                                            <option value="1230">V02 - 12:30 pm - 01:00 pm</option>
                                                            <option value="1300">V03 - 01:00 pm - 01:30 pm</option>
                                                            <option value="1330">V04 - 01:30 pm - 02:00 pm</option>
                                                            <option value="1400">V05 - 02:00 pm - 02:30 pm</option>
                                                            <option value="1430">V06 - 02:30 pm - 03:00 pm</option>
                                                            <option value="1500">V07 - 03:00 pm - 03:30 pm</option>
                                                            <option value="1530">V08 - 03:30 pm - 04:00 pm</option>
                                                            <option value="1600">V09 - 04:00 pm - 04:30 pm</option>
                                                            <option value="1630">V10 - 04:30 pm - 05:00 pm</option>
                                                            <option value="1700">V11 - 05:00 pm - 05:30 pm</option>
                                                            <option value="1730">V12 - 05:30 pm - 06:00 pm</option>
                                                            <option value="1800">N01 - 06:00 pm - 06:30 pm</option>
                                                            <option value="1830">N02 - 06:30 pm - 07:00 pm</option>
                                                            <option value="1900">N03 - 07:00 pm - 07:30 pm</option>
                                                            <option value="1930">N04 - 07:30 pm - 08:00 pm</option>
                                                            <option value="2000">N05 - 08:00 pm - 08:30 pm</option>
                                                            <option value="2030">N06 - 08:30 pm - 09:00 pm</option>
                                                            <option value="2100">N07 - 09:00 pm - 09:30 pm</option>
                                                            <option value="2130">N08 - 09:30 pm - 10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgmhorafin">Hora fin</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmhorafin" name="mgmhorafin">
                                                            <option value="0730">M01 - 07:00 am - 07:30 am</option>
                                                            <option value="0800">M02 - 07:30 am - 08:00 am</option>
                                                            <option value="0830">M03 - 08:00 am - 08:30 am</option>
                                                            <option value="0900">M04 - 08:30 am - 09:00 am</option>
                                                            <option value="0930">M05 - 09:00 am - 09:30 am</option>
                                                            <option value="1000">M06 - 09:30 am - 10:00 am</option>
                                                            <option value="1030">M07 - 10:00 am - 10:30 am</option>
                                                            <option value="1100">M08 - 10:30 am - 11:00 am</option>
                                                            <option value="1130">M09 - 11:00 am - 11:30 am</option>
                                                            <option value="1200">M10 - 11:30 am - 12:00 pm</option>
                                                            <option value="1230">V01 - 12:00 pm - 12:30 pm</option>
                                                            <option value="1300">V02 - 12:30 pm - 01:00 pm</option>
                                                            <option value="1330">V03 - 01:00 pm - 01:30 pm</option>
                                                            <option value="1400">V04 - 01:30 pm - 02:00 pm</option>
                                                            <option value="1430">V05 - 02:00 pm - 02:30 pm</option>
                                                            <option value="1500">V06 - 02:30 pm - 03:00 pm</option>
                                                            <option value="1530">V07 - 03:00 pm - 03:30 pm</option>
                                                            <option value="1600">V08 - 03:30 pm - 04:00 pm</option>
                                                            <option value="1630">V09 - 04:00 pm - 04:30 pm</option>
                                                            <option value="1700">V10 - 04:30 pm - 05:00 pm</option>
                                                            <option value="1730">V11 - 05:00 pm - 05:30 pm</option>
                                                            <option value="1800">V12 - 05:30 pm - 06:00 pm</option>
                                                            <option value="1830">N01 - 06:00 pm - 06:30 pm</option>
                                                            <option value="1900">N02 - 06:30 pm - 07:00 pm</option>
                                                            <option value="1930">N03 - 07:00 pm - 07:30 pm</option>
                                                            <option value="2000">N04 - 07:30 pm - 08:00 pm</option>
                                                            <option value="2030">N05 - 08:00 pm - 08:30 pm</option>
                                                            <option value="2100">N06 - 08:30 pm - 09:00 pm</option>
                                                            <option value="2130">N07 - 09:00 pm - 09:30 pm</option>
                                                            <option value="2200" selected>N08 - 09:30 pm - 10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgmcapacidad">Capacidad</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgmcapacidad" type="text" name="mgmcapacidad" value="0"
                                                            placeholder="Capacidad...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgmsesiones">Sesiones</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgmsesiones" type="text" name="mgmsesiones" value="0"
                                                            placeholder="Sesiones...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <button id="GrupoGuardar" slot="footer">GUARDAR</button>
                                        <button class="close" slot="footer">CERRAR</button>
                                    </x-modal>
                                    <x-modal id="ModalGrupoAsistencias" size="xl" canclose="true">
                                        <div slot="title">Asistencias del grupo</div>
                                        <div class="padder">
                                            <button data-export="export" class="btn-export"
                                                table="tsesiones">Exportar</button>
                                            <div>CALIFICACIÓN MÁXIMA: 100 PTS</div>
                                            <div class="table-overflow">
                                                <table id="tsesiones" class="select">
                                                    <thead>
                                                        <tr>
                                                            <th>MATRICULA</th>
                                                            <th>NOMBRE</th>
                                                            <th>CORREO</th>
                                                            <th colspan="1000">SESIONES</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="ResultadoSesiones">
                                                    </tbody>
                                                </table>
                                            </div>
                                            <!-- <form autocomplete="off">
                                            <div class="igrid-sm-12">
                                                test
                                            </div>
                                        </form> -->
                                        </div>
                                        <!-- <button id="AsistenciasGuardar" slot="footer">GUARDAR</button> -->
                                        <button class="close" slot="footer">CERRAR</button>
                                    </x-modal>
                                    <div class="padder">
                                        <div class="sticky">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                    <label for="mgmateria">Materia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmateria" name="mgmateria"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="mgSemestreMaestros">Semestre</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgSemestreMaestros" name="mgSemestreMaestros"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="mgnombre" class="d-none">Nombre</label>
                                                    <div class="inpt-wrapper d-none">
                                                        <input id="mgnombre" type="text" name="mgnombre"
                                                            placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="mgdia">Dia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgdia" name="mgdia">
                                                            <option value="TS" selected>TODOS</option>
                                                            <?php if (date("N") == 1) { ?>
                                                                <option value="LU">LUNES</option> <?php } else { ?>
                                                                <option value="LU">LUNES</option> <?php } ?>
                                                            <?php if (date("N") == 2) { ?>
                                                                <option value="MA">MARTES</option> <?php } else { ?>
                                                                <option value="MA">MARTES</option> <?php } ?>
                                                            <?php if (date("N") == 3) { ?>
                                                                <option value="MI">MIÉRCOLES</option> <?php } else { ?>
                                                                <option value="MI">MIÉRCOLES</option> <?php } ?>
                                                            <?php if (date("N") == 4) { ?>
                                                                <option value="JU">JUEVES</option> <?php } else { ?>
                                                                <option value="JU">JUEVES</option> <?php } ?>
                                                            <?php if (date("N") == 5) { ?>
                                                                <option value="VI">VIERNES</option> <?php } else { ?>
                                                                <option value="VI">VIERNES</option> <?php } ?>
                                                            <?php if (date("N") == 6) { ?>
                                                                <option value="SA">SÁBADO</option> <?php } else { ?>
                                                                <option value="SA">SÁBADO</option> <?php } ?>
                                                            <?php if (date("N") == 7) { ?>
                                                                <option value="DO">DOMINGO</option> <?php } else { ?>
                                                                <option value="DO">DOMINGO</option> <?php } ?>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mghorainicio">Hora inicio</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mghorainicio" name="mghorainicio" disabled>
                                                            <option value="0700" selected>M01 - 07:00 am - 07:30 am</option>
                                                            <option value="0730">M02 - 07:30 am - 08:00 am</option>
                                                            <option value="0800">M03 - 08:00 am - 08:30 am</option>
                                                            <option value="0830">M04 - 08:30 am - 09:00 am</option>
                                                            <option value="0900">M05 - 09:00 am - 09:30 am</option>
                                                            <option value="0930">M06 - 09:30 am - 10:00 am</option>
                                                            <option value="1000">M07 - 10:00 am - 10:30 am</option>
                                                            <option value="1030">M08 - 10:30 am - 11:00 am</option>
                                                            <option value="1100">M09 - 11:00 am - 11:30 am</option>
                                                            <option value="1130">M10 - 11:30 am - 12:00 pm</option>
                                                            <option value="1200">V01 - 12:00 pm - 12:30 pm</option>
                                                            <option value="1230">V02 - 12:30 pm - 01:00 pm</option>
                                                            <option value="1300">V03 - 01:00 pm - 01:30 pm</option>
                                                            <option value="1330">V04 - 01:30 pm - 02:00 pm</option>
                                                            <option value="1400">V05 - 02:00 pm - 02:30 pm</option>
                                                            <option value="1430">V06 - 02:30 pm - 03:00 pm</option>
                                                            <option value="1500">V07 - 03:00 pm - 03:30 pm</option>
                                                            <option value="1530">V08 - 03:30 pm - 04:00 pm</option>
                                                            <option value="1600">V09 - 04:00 pm - 04:30 pm</option>
                                                            <option value="1630">V10 - 04:30 pm - 05:00 pm</option>
                                                            <option value="1700">V11 - 05:00 pm - 05:30 pm</option>
                                                            <option value="1730">V12 - 05:30 pm - 06:00 pm</option>
                                                            <option value="1800">N01 - 06:00 pm - 06:30 pm</option>
                                                            <option value="1830">N02 - 06:30 pm - 07:00 pm</option>
                                                            <option value="1900">N03 - 07:00 pm - 07:30 pm</option>
                                                            <option value="1930">N04 - 07:30 pm - 08:00 pm</option>
                                                            <option value="2000">N05 - 08:00 pm - 08:30 pm</option>
                                                            <option value="2030">N06 - 08:30 pm - 09:00 pm</option>
                                                            <option value="2100">N07 - 09:00 pm - 09:30 pm</option>
                                                            <option value="2130">N08 - 09:30 pm - 10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mghorafin">Hora fin</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mghorafin" name="mghorafin" disabled>
                                                            <option value="0730">M01 - 07:00 am - 07:30 am</option>
                                                            <option value="0800">M02 - 07:30 am - 08:00 am</option>
                                                            <option value="0830">M03 - 08:00 am - 08:30 am</option>
                                                            <option value="0900">M04 - 08:30 am - 09:00 am</option>
                                                            <option value="0930">M05 - 09:00 am - 09:30 am</option>
                                                            <option value="1000">M06 - 09:30 am - 10:00 am</option>
                                                            <option value="1030">M07 - 10:00 am - 10:30 am</option>
                                                            <option value="1100">M08 - 10:30 am - 11:00 am</option>
                                                            <option value="1130">M09 - 11:00 am - 11:30 am</option>
                                                            <option value="1200">M10 - 11:30 am - 12:00 pm</option>
                                                            <option value="1230">V01 - 12:00 pm - 12:30 pm</option>
                                                            <option value="1300">V02 - 12:30 pm - 01:00 pm</option>
                                                            <option value="1330">V03 - 01:00 pm - 01:30 pm</option>
                                                            <option value="1400">V04 - 01:30 pm - 02:00 pm</option>
                                                            <option value="1430">V05 - 02:00 pm - 02:30 pm</option>
                                                            <option value="1500">V06 - 02:30 pm - 03:00 pm</option>
                                                            <option value="1530">V07 - 03:00 pm - 03:30 pm</option>
                                                            <option value="1600">V08 - 03:30 pm - 04:00 pm</option>
                                                            <option value="1630">V09 - 04:00 pm - 04:30 pm</option>
                                                            <option value="1700">V10 - 04:30 pm - 05:00 pm</option>
                                                            <option value="1730">V11 - 05:00 pm - 05:30 pm</option>
                                                            <option value="1800">V12 - 05:30 pm - 06:00 pm</option>
                                                            <option value="1830">N01 - 06:00 pm - 06:30 pm</option>
                                                            <option value="1900">N02 - 06:30 pm - 07:00 pm</option>
                                                            <option value="1930">N03 - 07:00 pm - 07:30 pm</option>
                                                            <option value="2000">N04 - 07:30 pm - 08:00 pm</option>
                                                            <option value="2030">N05 - 08:00 pm - 08:30 pm</option>
                                                            <option value="2100">N06 - 08:30 pm - 09:00 pm</option>
                                                            <option value="2130">N07 - 09:00 pm - 09:30 pm</option>
                                                            <option value="2200" selected>N08 - 09:30 pm - 10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                </div>
                                            </form>
                                            <button id="BuscarGrupos">Buscar</button>
                                        </div>
                                        <div class="table-overflow">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>ACCIONES</th>
                                                        <th>MATERIA</th>
                                                        <th>NOMBRE</th>
                                                        <th>DIA</th>
                                                        <th>HORA INICIO</th>
                                                        <th>HORA FIN</th>
                                                        <th>LIMITE</th>
                                                        <th>SESIONES</th>
                                                        <th>INSCRITOS</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="ResultadoGrupos">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div slot="tabs" id="AlumnoGrupos" class="container">
                                <div class="content">
                                    <x-modal id="mdlBuscarAlumno" size="lg" canclose="true">
                                        <div slot="title">Buscar alumno</div>
                                        <div class="padder">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2">
                                                    <label for="mgBuscarMatricula">Matrícula</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarMatricula" type="text" name="mgBuscarMatricula"
                                                            placeholder="Matrícula...">
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    

                                                    <label for="mgBuscarNombre">Nombre</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarNombre" type="text" name="mgBuscarNombre"
                                                            placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="mgBuscarApPaterno">Ap. paterno</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarApPaterno" type="text" name="mgBuscarApPaterno"
                                                            placeholder="Apellido paterno...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgBuscarApMaterno">Ap. materno</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarApMaterno" type="text" name="mgBuscarApMaterno"
                                                            placeholder="Apellido materno...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                </div>
                                            </form>
                                            <button id="btnBuscarAlumno">Buscar</button>
                                            <div class="table-overflow">
                                                <table class="select">
                                                    <thead>
                                                        <tr>
                                                            <th>MATRICULA</th>
                                                            <th>NOMBRE</th>
                                                            <th>CORREO</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="ResultadoBuscarAlumno">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <button class="close" slot="footer">CERRAR</button>
                                    </x-modal>
                                    <div class="padder">
                                        <div class="sticky">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                    <label for="agmateria">Materia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="agmateria" name="agmateria"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="agnombre" class="d-none">Nombre</label>
                                                    <div class="inpt-wrapper d-none">
                                                        <input id="agnombre" type="text" name="agnombre"
                                                            placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="mgSemestreMaestrosInscripcion">Semestre</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgSemestreMaestrosInscripcion" name="mgSemestreMaestrosInscripcion"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="">Grupo</label>
                                                    <div class="inpt-wrapper">
                                                        <select name="slGruposMateria" id="slGruposMateria" disabled>
                                                            <option value="0">Seleccione la materia...</option>
                                                        </select>
                                                    </div>
                                                    
                                                    <label for="mgalumno">Alumno</label>
                                                    <div class="inpt-wrapper inpt-group">
                                                        <input id="mgalumno" type="text" name="mgalumno"
                                                            placeholder="Matrícula..." class="mr-1">

                                                        <button id="btnFiltrarAlumno" class="mr-1 d-none"
                                                            onclick="return false;">Buscar</button>
                                                        <button id="btnLimpiarAlumno" class="d-none"
                                                            onclick="return false;">Limpiar</button>

                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="agdia">Dia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="agdia" name="agdia">
                                                            <option value="TS" selected>TODOS</option>
                                                            <?php if (date("N") == 1) { ?>
                                                                <option value="LU">LUNES</option> <?php } else { ?>
                                                                <option value="LU">LUNES</option> <?php } ?>
                                                            <?php if (date("N") == 2) { ?>
                                                                <option value="MA">MARTES</option> <?php } else { ?>
                                                                <option value="MA">MARTES</option> <?php } ?>
                                                            <?php if (date("N") == 3) { ?>
                                                                <option value="MI">MIÉRCOLES</option> <?php } else { ?>
                                                                <option value="MI">MIÉRCOLES</option> <?php } ?>
                                                            <?php if (date("N") == 4) { ?>
                                                                <option value="JU">JUEVES</option> <?php } else { ?>
                                                                <option value="JU">JUEVES</option> <?php } ?>
                                                            <?php if (date("N") == 5) { ?>
                                                                <option value="VI">VIERNES</option> <?php } else { ?>
                                                                <option value="VI">VIERNES</option> <?php } ?>
                                                            <?php if (date("N") == 6) { ?>
                                                                <option value="SA">SÁBADO</option> <?php } else { ?>
                                                                <option value="SA">SÁBADO</option> <?php } ?>
                                                            <?php if (date("N") == 7) { ?>
                                                                <option value="DO">DOMINGO</option> <?php } else { ?>
                                                                <option value="DO">DOMINGO</option> <?php } ?>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="aghorainicio">Hora inicio</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="aghorainicio" name="aghorainicio" disabled>
                                                            <option value="0700" selected>M01 - 07:00 am - 07:30 am</option>
                                                            <option value="0730">M02 - 07:30 am - 08:00 am</option>
                                                            <option value="0800">M03 - 08:00 am - 08:30 am</option>
                                                            <option value="0830">M04 - 08:30 am - 09:00 am</option>
                                                            <option value="0900">M05 - 09:00 am - 09:30 am</option>
                                                            <option value="0930">M06 - 09:30 am - 10:00 am</option>
                                                            <option value="1000">M07 - 10:00 am - 10:30 am</option>
                                                            <option value="1030">M08 - 10:30 am - 11:00 am</option>
                                                            <option value="1100">M09 - 11:00 am - 11:30 am</option>
                                                            <option value="1130">M10 - 11:30 am - 12:00 pm</option>
                                                            <option value="1200">V01 - 12:00 pm - 12:30 pm</option>
                                                            <option value="1230">V02 - 12:30 pm - 01:00 pm</option>
                                                            <option value="1300">V03 - 01:00 pm - 01:30 pm</option>
                                                            <option value="1330">V04 - 01:30 pm - 02:00 pm</option>
                                                            <option value="1400">V05 - 02:00 pm - 02:30 pm</option>
                                                            <option value="1430">V06 - 02:30 pm - 03:00 pm</option>
                                                            <option value="1500">V07 - 03:00 pm - 03:30 pm</option>
                                                            <option value="1530">V08 - 03:30 pm - 04:00 pm</option>
                                                            <option value="1600">V09 - 04:00 pm - 04:30 pm</option>
                                                            <option value="1630">V10 - 04:30 pm - 05:00 pm</option>
                                                            <option value="1700">V11 - 05:00 pm - 05:30 pm</option>
                                                            <option value="1730">V12 - 05:30 pm - 06:00 pm</option>
                                                            <option value="1800">N01 - 06:00 pm - 06:30 pm</option>
                                                            <option value="1830">N02 - 06:30 pm - 07:00 pm</option>
                                                            <option value="1900">N03 - 07:00 pm - 07:30 pm</option>
                                                            <option value="1930">N04 - 07:30 pm - 08:00 pm</option>
                                                            <option value="2000">N05 - 08:00 pm - 08:30 pm</option>
                                                            <option value="2030">N06 - 08:30 pm - 09:00 pm</option>
                                                            <option value="2100">N07 - 09:00 pm - 09:30 pm</option>
                                                            <option value="2130">N08 - 09:30 pm - 10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="aghorafin">Hora fin</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="aghorafin" name="aghorafin" disabled>
                                                            <option value="0730">M01 - 07:00 am - 07:30 am</option>
                                                            <option value="0800">M02 - 07:30 am - 08:00 am</option>
                                                            <option value="0830">M03 - 08:00 am - 08:30 am</option>
                                                            <option value="0900">M04 - 08:30 am - 09:00 am</option>
                                                            <option value="0930">M05 - 09:00 am - 09:30 am</option>
                                                            <option value="1000">M06 - 09:30 am - 10:00 am</option>
                                                            <option value="1030">M07 - 10:00 am - 10:30 am</option>
                                                            <option value="1100">M08 - 10:30 am - 11:00 am</option>
                                                            <option value="1130">M09 - 11:00 am - 11:30 am</option>
                                                            <option value="1200">M10 - 11:30 am - 12:00 pm</option>
                                                            <option value="1230">V01 - 12:00 pm - 12:30 pm</option>
                                                            <option value="1300">V02 - 12:30 pm - 01:00 pm</option>
                                                            <option value="1330">V03 - 01:00 pm - 01:30 pm</option>
                                                            <option value="1400">V04 - 01:30 pm - 02:00 pm</option>
                                                            <option value="1430">V05 - 02:00 pm - 02:30 pm</option>
                                                            <option value="1500">V06 - 02:30 pm - 03:00 pm</option>
                                                            <option value="1530">V07 - 03:00 pm - 03:30 pm</option>
                                                            <option value="1600">V08 - 03:30 pm - 04:00 pm</option>
                                                            <option value="1630">V09 - 04:00 pm - 04:30 pm</option>
                                                            <option value="1700">V10 - 04:30 pm - 05:00 pm</option>
                                                            <option value="1730">V11 - 05:00 pm - 05:30 pm</option>
                                                            <option value="1800">V12 - 05:30 pm - 06:00 pm</option>
                                                            <option value="1830">N01 - 06:00 pm - 06:30 pm</option>
                                                            <option value="1900">N02 - 06:30 pm - 07:00 pm</option>
                                                            <option value="1930">N03 - 07:00 pm - 07:30 pm</option>
                                                            <option value="2000">N04 - 07:30 pm - 08:00 pm</option>
                                                            <option value="2030">N05 - 08:00 pm - 08:30 pm</option>
                                                            <option value="2100">N06 - 08:30 pm - 09:00 pm</option>
                                                            <option value="2130">N07 - 09:00 pm - 09:30 pm</option>
                                                            <option value="2200" selected>N08 - 09:30 pm - 10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                </div>
                                            </form>
                                            <button id="btnBuscarGruposPorAlumno">Buscar</button>
                                        </div>
                                        <div class="table-overflow">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <!-- <th>ACCIONES</th> -->
                                                        <th>MATRICULA</th>
                                                        <th>ALUMNO</th>
                                                        <th>MATERIA</th>
                                                        <th>GRUPO</th>
                                                        <th>DIA</th>
                                                        <th>HORA INICIO</th>
                                                        <th>HORA FIN</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="ResultadoAlumnoGrupos">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div slot="tabs" id="Tickets" class="container">
                                <div class="content">
                                    <!-- <x-modal id="mdlBuscarAlumno" size="lg" canclose="true">
                                        <div slot="title">Buscar alumno</div>
                                        <div class="padder">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2">
                                                    <label for="mgBuscarMatricula">Matrícula</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarMatricula" type="text" name="mgBuscarMatricula" placeholder="Matrícula...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgBuscarNombre">Nombre</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarNombre" type="text" name="mgBuscarNombre" placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="mgBuscarApPaterno">Ap. paterno</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarApPaterno" type="text" name="mgBuscarApPaterno" placeholder="Apellido paterno...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="mgBuscarApMaterno">Ap. materno</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgBuscarApMaterno" type="text" name="mgBuscarApMaterno" placeholder="Apellido materno...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                </div>
                                            </form>
                                            <button id="btnBuscarAlumno">Buscar</button>
                                            <div class="table-overflow">
                                                <table class="select">
                                                    <thead>
                                                        <tr>
                                                            <th>MATRICULA</th>
                                                            <th>NOMBRE</th>
                                                            <th>CORREO</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="ResultadoBuscarAlumno">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <button class="close" slot="footer">CERRAR</button>
                                    </x-modal> -->
                                    <div class="padder">
                                        <!-- <div class="sticky">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                    <label for="agmateria">Materia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="agmateria" name="agmateria"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="agnombre" class="d-none">Nombre</label>
                                                    <div class="inpt-wrapper d-none">
                                                        <input id="agnombre" type="text" name="agnombre" placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="">Grupo</label>
                                                    <div class="inpt-wrapper">
                                                        <select name="slGruposMateria" id="slGruposMateria" disabled>
                                                            <option value="0">Seleccione la materia...</option>
                                                        </select>
                                                    </div>
                                                    <label for="mgalumno">Alumno</label>
                                                    <div class="inpt-wrapper inpt-group">
                                                        <input id="mgalumno" type="text" name="mgalumno" placeholder="Matrícula..." class="mr-1">

                                                        <button id="btnFiltrarAlumno" class="mr-1 d-none" onclick="return false;">Buscar</button>
                                                        <button id="btnLimpiarAlumno" class = "d-none" onclick="return false;">Limpiar</button>

                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="agdia">Dia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="agdia" name="agdia">
                                                            <option value="TS" selected>TODOS</option>
                                                            <?php if (date("N") == 1) { ?> <option value="LU">LUNES</option>        <?php } else { ?><option value="LU">LUNES</option>     <?php } ?>
                                                            <?php if (date("N") == 2) { ?> <option value="MA">MARTES</option>       <?php } else { ?><option value="MA">MARTES</option>    <?php } ?>
                                                            <?php if (date("N") == 3) { ?> <option value="MI">MIÉRCOLES</option>    <?php } else { ?><option value="MI">MIÉRCOLES</option> <?php } ?>
                                                            <?php if (date("N") == 4) { ?> <option value="JU">JUEVES</option>       <?php } else { ?><option value="JU">JUEVES</option>    <?php } ?>
                                                            <?php if (date("N") == 5) { ?> <option value="VI">VIERNES</option>      <?php } else { ?><option value="VI">VIERNES</option>   <?php } ?>
                                                            <?php if (date("N") == 6) { ?> <option value="SA">SÁBADO</option>       <?php } else { ?><option value="SA">SÁBADO</option>    <?php } ?>
                                                            <?php if (date("N") == 7) { ?> <option value="DO">DOMINGO</option>      <?php } else { ?><option value="DO">DOMINGO</option>   <?php } ?>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="aghorainicio">Hora inicio</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="aghorainicio" name="aghorainicio" disabled>
                                                            <option value="0700" selected>M01  -  07:00 am  -  07:30 am</option>
                                                            <option value="0730">M02  -  07:30 am  -  08:00 am</option>
                                                            <option value="0800">M03  -  08:00 am  -  08:30 am</option>
                                                            <option value="0830">M04  -  08:30 am  -  09:00 am</option>
                                                            <option value="0900">M05  -  09:00 am  -  09:30 am</option>
                                                            <option value="0930">M06  -  09:30 am  -  10:00 am</option>
                                                            <option value="1000">M07  -  10:00 am  -  10:30 am</option>
                                                            <option value="1030">M08  -  10:30 am  -  11:00 am</option>
                                                            <option value="1100">M09  -  11:00 am  -  11:30 am</option>
                                                            <option value="1130">M10  -  11:30 am  -  12:00 pm</option>
                                                            <option value="1200">V01  -  12:00 pm  -  12:30 pm</option>
                                                            <option value="1230">V02  -  12:30 pm  -  01:00 pm</option>
                                                            <option value="1300">V03  -  01:00 pm  -  01:30 pm</option>
                                                            <option value="1330">V04  -  01:30 pm  -  02:00 pm</option>
                                                            <option value="1400">V05  -  02:00 pm  -  02:30 pm</option>
                                                            <option value="1430">V06  -  02:30 pm  -  03:00 pm</option>
                                                            <option value="1500">V07  -  03:00 pm  -  03:30 pm</option>
                                                            <option value="1530">V08  -  03:30 pm  -  04:00 pm</option>
                                                            <option value="1600">V09  -  04:00 pm  -  04:30 pm</option>
                                                            <option value="1630">V10  -  04:30 pm  -  05:00 pm</option>
                                                            <option value="1700">V11  -  05:00 pm  -  05:30 pm</option>
                                                            <option value="1730">V12  -  05:30 pm  -  06:00 pm</option>
                                                            <option value="1800">N01  -  06:00 pm  -  06:30 pm</option>
                                                            <option value="1830">N02  -  06:30 pm  -  07:00 pm</option>
                                                            <option value="1900">N03  -  07:00 pm  -  07:30 pm</option>
                                                            <option value="1930">N04  -  07:30 pm  -  08:00 pm</option>
                                                            <option value="2000">N05  -  08:00 pm  -  08:30 pm</option>
                                                            <option value="2030">N06  -  08:30 pm  -  09:00 pm</option>
                                                            <option value="2100">N07  -  09:00 pm  -  09:30 pm</option>
                                                            <option value="2130">N08  -  09:30 pm  -  10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="aghorafin">Hora fin</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="aghorafin" name="aghorafin" disabled>
                                                            <option value="0730">M01  -  07:00 am  -  07:30 am</option>
                                                            <option value="0800">M02  -  07:30 am  -  08:00 am</option>
                                                            <option value="0830">M03  -  08:00 am  -  08:30 am</option>
                                                            <option value="0900">M04  -  08:30 am  -  09:00 am</option>
                                                            <option value="0930">M05  -  09:00 am  -  09:30 am</option>
                                                            <option value="1000">M06  -  09:30 am  -  10:00 am</option>
                                                            <option value="1030">M07  -  10:00 am  -  10:30 am</option>
                                                            <option value="1100">M08  -  10:30 am  -  11:00 am</option>
                                                            <option value="1130">M09  -  11:00 am  -  11:30 am</option>
                                                            <option value="1200">M10  -  11:30 am  -  12:00 pm</option>
                                                            <option value="1230">V01  -  12:00 pm  -  12:30 pm</option>
                                                            <option value="1300">V02  -  12:30 pm  -  01:00 pm</option>
                                                            <option value="1330">V03  -  01:00 pm  -  01:30 pm</option>
                                                            <option value="1400">V04  -  01:30 pm  -  02:00 pm</option>
                                                            <option value="1430">V05  -  02:00 pm  -  02:30 pm</option>
                                                            <option value="1500">V06  -  02:30 pm  -  03:00 pm</option>
                                                            <option value="1530">V07  -  03:00 pm  -  03:30 pm</option>
                                                            <option value="1600">V08  -  03:30 pm  -  04:00 pm</option>
                                                            <option value="1630">V09  -  04:00 pm  -  04:30 pm</option>
                                                            <option value="1700">V10  -  04:30 pm  -  05:00 pm</option>
                                                            <option value="1730">V11  -  05:00 pm  -  05:30 pm</option>
                                                            <option value="1800">V12  -  05:30 pm  -  06:00 pm</option>
                                                            <option value="1830">N01  -  06:00 pm  -  06:30 pm</option>
                                                            <option value="1900">N02  -  06:30 pm  -  07:00 pm</option>
                                                            <option value="1930">N03  -  07:00 pm  -  07:30 pm</option>
                                                            <option value="2000">N04  -  07:30 pm  -  08:00 pm</option>
                                                            <option value="2030">N05  -  08:00 pm  -  08:30 pm</option>
                                                            <option value="2100">N06  -  08:30 pm  -  09:00 pm</option>
                                                            <option value="2130">N07  -  09:00 pm  -  09:30 pm</option>
                                                            <option value="2200" selected>N08  -  09:30 pm  -  10:00 pm</option>
                                                        </select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                </div>
                                            </form>
                                            <button id="btnBuscarGruposPorAlumno">Buscar</button>
                                        </div> -->
                                        <button id="CrearTicket">Crear nuevo ticket</button>

                                        <div class="table-overflow">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>ACCIONES</th>
                                                        <th>N° TICKET</th>
                                                        <th>AULA</th>
                                                        <th>EQUIPO</th>
                                                        <th>DESCRIPCION</th>
                                                        <th>ESTADO</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="ResultadoTickets">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div slot="tabs" id="SolicitarEquipo" class="container">

                                <div class="mt-4">
                                    <button id="solicitarEquipoBtn">Solicitar Equipo</button>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 p-2">
                                        <h3 class="text-center">Solicitudes de Pedidos</h3>
                                        <div class="overflow-auto">
                                            <table class="table table-bordered" id="tablaSolicitudesPendientes">
                                                <thead>
                                                    <tr>
                                                        <th># Solicitud</th>
                                                        <th>Equipo</th>
                                                        <th>Estatus</th>
                                                        <th>Fecha de Inicio</th>
                                                        <th>Fecha Fin</th>
                                                        <th>Fecha de Alta</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="col-md-6 p-2">
                                        <h3 class="text-center">Solicitudes pasadas.</h3>
                                        <div class="overflow-auto">
                                            <table class="table table-bordered" id="tablaSolicitudesAceptadas">
                                                <thead>
                                                    <tr>
                                                        <th># Solicitud</th>
                                                        <th>Equipo</th>
                                                        <th>Estatus</th>
                                                        <th>Fecha de Inicio</th>
                                                        <th>Fecha Fin</th>
                                                        <th>Fecha de Alta</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div slot="tabs" id="SolicitarAula" class="container">
                                <?php include 'solicitar_aula_view.php' ?>
                            </div>

                        <?php } else { ?>

                            <?php alerta_incorrecto($input . " correo universitario NO valido o inexistente, favor de cambiarlo en el apartado PERFIL para poder visualizar los grupos inscritos y darse de alta a un grupo"); ?>

                            <!-- <x-modal active="true" canclose="true" size="sm">
                                <div slot="title">PERFIL</div>
                                <div class="padder"> <?php $input ?>  correo universitario NO válido, favor de actualizarlo en el apartado PERFIL para poder visualizar los grupos inscritos y darse de alta a un grupo </div>
                                <button slot="footer" autofocus class="close">Cerrar</button>
                                </x-modal> -->

                        <?php } ?>
                    </x-tab>
                </div>
            </div>


            <div class="main-footer"><x-timer></x-timer></div>
            <input id="ProfesorId" value="<?php echo $_SESSION["user"]["Id"] ?>" class="d-none"></input>
        </div>
    </div>




    <input id="last" type="text">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
    <script src="jquery-3.6.0.min.js"></script>
    <script src="jquery.tabletoCSV.js"></script>
    <script type="module" src="main.js"></script>
    <script type="module" src="js/ticketsMaestros.js"></script>
    <script type="module" src="js/solicitar_equipoMaestro.js"></script>
    <!-- <script type="module" src="usuario.js"></script> -->
    <!-- <script type="module" src="grupo.js"></script> -->
    <!-- <script type="module" src="materia.js"></script> -->
    <script type="module" src="maestrosmain.js"></script>
    <!-- <script type="module" src="misgrupos.js"></script> -->
    <!-- <script type="module" src="inscribirgrupos.js"></script> -->
    <!-- <script src="js/aulas_solicitar.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>

</html>