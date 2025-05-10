<?php
date_default_timezone_set("America/Mexico_City");
session_start();
if (isset($_SESSION["user"])) {
    if ($_SESSION["user"]["PerfilId"] == 1) {
        header('Location: main.php');
    } else if ($_SESSION["user"]["PerfilId"] == 2 || $_SESSION["user"]["PerfilId"] == 5) {
        header('Location: maestrosmain.php');
    } elseif ($_SESSION["user"]["PerfilId"] == 6) {
        header('Location: soportemain');
    }
} else {
    header('Location: index.php');
}


//------------RECORDAR AL USUARIO SI SU CORREO INSTITUCIONAL ES VALIDO O NO---------------//

$message = "";
$formatoAntiguo = '/^[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/';
$formatoActual = '/^[a-zA-Z0-9_\.+]+(\.)+[a-zA-Z0-9_\.+]+@(uanl)(\.edu)(\.mx)$/';
$formato = '/^[a-zA-Z0-9_+.-]+@uanl\.edu\.mx$/i';
$input = $_SESSION["user"]["Correo"];


/*if (preg_match($regex, $input)) {
            alerta_correcto( $input. " es un correo valido!");
           } else { 
            alerta_incorrecto( $input. " es un correo NO valido, favor de cambiarlo");
           }    

        */

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
    <title>GRUPOS</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Incluir los archivos de Bootstrap -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    
    <link href="css/floating-labels.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="style.css">

</head>

<body>
    <input type="hidden" name="id_usuario_actual" id="id_usuario_actual" value="<?php echo $_SESSION["user"]["Id"]; ?>">
    <div id="wrapper" class="main-wrapper theme09">

        <input type="hidden" class="form-control mt-2" id="usuario_actual" name="usuario_actual" value="4">

        <?php if (strlen(trim($_SESSION["user"]["Correo"])) <= 0) { ?>
            <x-modal active="true" canclose="true" size="sm">
                <div slot="title">PERFIL</div>
                <div class="padder">Recuerda introducir tu correo, en el apartado PERFIL del menu lateral</div>
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
                            <div class="igrid-m-4">
                                <label for="contraseña">El correo debe terminar en: @uanl.edu.mx </label>
                            </div>
                            <div class="igrid-sm-2">
                                <label for="correo">Correo</label>
                                <div class="inpt-wrapper">
                                    <input id="correo" name="correo" type="text"
                                        value="<?= trim($_SESSION["user"]["Correo"]) ?>" placeholder="Correo...">
                                    <!-- <label for="contraseña">El formato de correo debe ser el siguiente: nombre.apellido@uanl.edu.mx </label> -->
                                    <div class="inpt-under"></div>
                                </div>
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
                    <div slot="header">Bienvenido <?= $_SESSION["user"]["Nombre"] ?></div>
                    <div slot="footer"></div>
                    <div id="logout" class="menu-option wave">CERRAR SESIÓN</div>
                    <div id="perfil" class="menu-option wave">PERFIL</div>
                </x-menu>
                <div class="main-content">
                    <x-tab main>

                        <?php if (preg_match($formato, $input)) //preg_match($formatoAntiguo, $input) || preg_match($formatoActual, $input)) 
                        { ?>

                            <?php //alerta_correcto( $input. " es un correo valido!"); 
                                ?>


                            <div slot="items" class="tab-item wave" ref="MisGrupos">MIS GRUPOS</div>
                            <div slot="items" class="tab-item wave" ref="InscribirGrupo">INSCRIBIRSE A GRUPO</div>
                            <div slot="items" class="tab-item wave" ref="SolicitarAula">SOLICITAR AULA</div>
                            <div slot="items" class="tab-item wave" ref="SolicitarEquipo">SOLICITAR EQUIPO</div>

                            <div slot="tabs" id="MisGrupos" class="container">
                                <div class="content">
                                    <div class="padder">
                                        <div class="sticky">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                    <label for="mgmateria">Materia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmateria" name="mgmateria"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="mgmSemestresAlumnos">Semestre</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmSemestresAlumnos" name="mgmSemestresAlumnos"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <label for="mgnombre">Nombre</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="mgnombre" type="text" name="mgnombre"
                                                            placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>

                                                    <div class="gridbreak"></div>
                                                    <label for="mgdia">Dia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgdia" name="mgdia">
                                                            <option value="TS" selected>TODOS</option>
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
                                                    <label for="mghorainicio">Hora inicio</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mghorainicio" name="mghorainicio">
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
                                                        <select id="mghorafin" name="mghorafin">
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
                                            <button id="BuscarMisGrupos">Buscar</button>
                                        </div>
                                        <div class="table-overflow">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>ACCIONES</th>
                                                        <th>MATERIA</th>
                                                        <th>GRUPO</th>
                                                        <th>AULA</th>
                                                        <th>DIA</th>
                                                        <th>HORA INICIO</th>
                                                        <th>HORA FIN</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="ResultadoMisGrupos">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div slot="tabs" id="InscribirGrupo" class="container">
                                <div class="content">
                                    <div class="padder">
                                        <div class="sticky">
                                            <form autocomplete="off">
                                                <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                    <label for="mgmateriaInscribir">Materia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="mgmateriaInscribir" name="mgmateriaInscribir"></select>
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <label for="ignombre">Nombre</label>
                                                    <div class="inpt-wrapper">
                                                        <input id="ignombre" type="text" name="ignombre"
                                                            placeholder="Nombre...">
                                                        <div class="inpt-under"></div>
                                                    </div>
                                                    <div class="gridbreak"></div>
                                                    <label for="igdia">Dia</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="igdia" name="igdia">
                                                            <option value="TS" selected>TODOS</option>
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
                                                    <label for="ighorainicio">Hora inicio</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="ighorainicio" name="ighorainicio">
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
                                                    <label for="ighorafin">Hora fin</label>
                                                    <div class="inpt-wrapper">
                                                        <select id="ighorafin" name="ighorafin">
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
                                            <button id="BuscarInscribirGrupos">Buscar</button>
                                        </div>
                                        <div class="table-overflow">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>ACCIONES</th>
                                                        <th>MATERIA</th>
                                                        <th>GRUPO</th>
                                                        <th>AULA</th>
                                                        <th>DIA</th>
                                                        <th>HORA INICIO</th>
                                                        <th>HORA FIN</th>
                                                        <th>INSCRITOS</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="ResultadoInscribirGrupos">
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

                    </div>

                <?php } else { ?>

                    <?php alerta_incorrecto($input . " correo universitario NO valido o inexistente, favor de cambiarlo en el apartado PERFIL para poder visualizar los grupos inscritos y darse de alta a un grupo"); ?>

                    <x-modal active="true" canclose="true" size="sm">
                        <div slot="title">PERFIL</div>
                        <div class="padder"> <?php $input ?> correo universitario NO válido, favor de actualizarlo
                            en el apartado PERFIL para poder visualizar los grupos inscritos y darse de alta a un
                            grupo </div>
                        <button slot="footer" autofocus class="close">Cerrar</button>
                    </x-modal>

                <?php } ?>


                </x-tab>
            </div>

        <div class="main-footer"><x-timer></x-timer></div>
    </div>



    <input id="last" type="text">
    <script type="module" src="register.js"></script>
    <script type="module" src="misgrupos.js"></script>
    <script type="module" src="inscribirgrupos.js"></script>
    <script src="jquery-3.6.0.min.js"></script>
    <script src="js/solicitar_equipo.js"></script>
    <!-- <script src="js/aulas_solicitar.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>

</html>