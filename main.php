<?php
date_default_timezone_set("America/Mexico_City");
session_start();
if (isset($_SESSION["user"])) {
    if ($_SESSION["user"]["PerfilId"] !== 1) {
        if ($_SESSION["user"]["PerfilId"] == 2 || $_SESSION["user"]["PerfilId"] == 5) {
            header('Location: maestrosmain');
        } elseif ($_SESSION["user"]["PerfilId"] == 6) {
            header('Location: soportemain');
        } else {
            header('Location: register');
        }
    }
} else {
    header('Location: index');
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
    <input type="hidden" name="usuario_logeado" id="usuario_logeado" value="<?php echo $_SESSION["user"]["Id"]; ?>">
    <div id="wrapper" class="main-wrapper theme09">
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
                </x-menu>
                <div class="main-content">
                    <x-tab main>
                        <div slot="items" class="tab-item wave" ref="Alumnos">USUARIOS</div>
                        <div slot="items" class="tab-item wave" ref="Materias">MATERIAS</div>
                        <div slot="items" class="tab-item wave" ref="Grupos">GRUPOS</div>
                        <div slot="items" class="tab-item wave" ref="AlumnoGrupos">INSCRIPCIONES</div>
                        <div slot="items" class="tab-item wave" ref="Tickets">TICKETS</div>
                        <div slot="items" class="tab-item wave" ref="Aulas">PRÉSTAMO AULA</div>
                        <div slot="items" class="tab-item wave" ref="CalendarioAulas">CALENDARIO AULAS</div>
                        <div slot="items" class="tab-item wave" ref="ConfigAulas">AULAS</div>
                        <div slot="items" class="tab-item wave" ref="PrestamoEquipos">PRESTAMO EQUIPOS</div>
                        <div slot="items" class="tab-item wave" ref="Equipos">EQUIPOS</div>
                        <div slot="items" class="tab-item wave" ref="Reportes">REPORTES</div>


                        <div slot="tabs" id="Alumnos" class="container">
                            <div class="content">
                                <x-modal id="ModalAlumno" size="md" canclose="true">
                                    <div slot="title"></div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <input id="mid" type="hidden">
                                            <div class="igrid-sm-2">
                                                <label for="mmatricula">Matrícula</label>
                                                <div class="inpt-wrapper">
                                                    <input id="mmatricula" type="text" name="mmatricula"
                                                        placeholder="Matrícula..." autofocus>
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="mnombre">Nombre</label>
                                                <div class="inpt-wrapper">
                                                    <input id="mnombre" type="text" name="mnombre"
                                                        placeholder="Nombre...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="mprimerap">Primer ap.</label>
                                                <div class="inpt-wrapper">
                                                    <input id="mprimerap" type="text" name="mprimerap"
                                                        placeholder="Primer ap...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="msegundoap">Segundo ap.</label>
                                                <div class="inpt-wrapper">
                                                    <input id="msegundoap" type="text" name="msegundoap"
                                                        placeholder="Segundo ap...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="mcorreo">Correo</label>
                                                <div class="inpt-wrapper">
                                                    <input id="mcorreo" type="text" name="mcorreo"
                                                        placeholder="Correo...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="mperfil">Perfil</label>
                                                <div class="inpt-wrapper">
                                                    <select id="mperfil" name="mperfil">
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <button id="AlumnoGuardar" slot="footer">GUARDAR</button>
                                    
                                </x-modal>
                                <x-modal id="ModalAlumnoBaneo" size="md" canclose="true">
                                    <div slot="title"></div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <input id="midBaneo" type="hidden">
                                            <div class="igrid-sm">
                                                <label for="mmotivobaneo">Motivo: </label>
                                                <div class="inpt-wrapper">
                                                    <textarea id="mmotivobaneo" name="mmotivobaneo" rows="4" cols="50"
                                                        placeholder="Motivo de Baneo..."></textarea>
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <button id="AlumnoBaneo" slot="footer">Banear</button>
                                   
                                </x-modal>

                                <x-modal id="ModalAlumnoDesbaneo" size="md" canclose="true">
                                    <div slot="title"></div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <input id="midDesbaneo" type="hidden">
                                            <div class="igrid-sm">
                                                <label for="mmotivodesbaneo">Motivo de Desbaneo: </label>
                                                <div class="inpt-wrapper">
                                                    <textarea id="mmotivodesbaneo" name="mmotivodesbaneo" rows="4"
                                                        cols="50" placeholder="Motivo de Desbaneo..."></textarea>
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <button id="AlumnoDesbaneo" slot="footer">Desbanear</button>
                                   
                                </x-modal>


                                <div class="padder">
                                    <div class="sticky">
                                        <form autocomplete="off">
                                            <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                <label for="matricula">Matrícula</label>
                                                <div class="inpt-wrapper">
                                                    <input id="matricula" type="text" name="matricula"
                                                        placeholder="Matrícula..." autofocus>
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="nombre">Nombre</label>
                                                <div class="inpt-wrapper">
                                                    <input id="nombre" type="text" name="nombre"
                                                        placeholder="Nombre...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="primerap">Primer ap.</label>
                                                <div class="inpt-wrapper">
                                                    <input id="primerap" type="text" name="primerap"
                                                        placeholder="Primer ap...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="segundoap">Segundo ap.</label>
                                                <div class="inpt-wrapper">
                                                    <input id="segundoap" type="text" name="segundoap"
                                                        placeholder="Segundo ap...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="perfil">Perfil</label>
                                                <div class="inpt-wrapper">
                                                    <select id="perfil" name="perfil" value="4">
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="estatus">Estatus</label>
                                                <div class="inpt-wrapper">
                                                    <select id="estatus" name="estatus">
                                                        <option value="1" selected>Activos</option>
                                                        <option value="0">Inactivos</option>
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="baneados">Baneados</label>
                                                <div class="inpt-wrapper">
                                                    <select id="baneados" name="baneados">
                                                        <option value="0" selected>No</option>
                                                        <option value="1">Sí</option>
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                        <button id="BuscarAlumnos">Buscar</button>
                                        <button id="AgregarAlumnos">Agregar</button>
                                        <button id="ImportarAlumnos">Importar desde excel</button>
                                    </div>
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>MATRICULA</th>
                                                    <th>NOMBRE</th>
                                                    <th>CORREO</th>
                                                    <th>ESTATUS</th>
                                                    <th>BANEO</th>
                                                    <th>MOTIVO DE BANEO</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadoAlumnos">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div slot="tabs" id="Materias" class="container">
                            <div class="content">
                                <x-modal id="ModalMateria" size="md" canclose="true">
                                    <div slot="title"></div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <input id="maid" type="hidden">
                                            <div class="igrid-sm-2">
                                                <label for="mmanombre">Nombre</label>
                                                <div class="inpt-wrapper">
                                                    <input id="mmanombre" type="text" name="mmanombre" autofocus
                                                        placeholder="Nombre...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <button id="MateriaGuardar" slot="footer">GUARDAR</button>
                                    
                                </x-modal>
                                <div class="padder">
                                    <div class="sticky">
                                        <form autocomplete="off">
                                            <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                <label for="manombre">Nombre</label>
                                                <div class="inpt-wrapper">
                                                    <input id="manombre" type="text" name="manombre"
                                                        placeholder="Nombre...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="estatusC">Estatus</label>
                                                <div class="inpt-wrapper">
                                                    <select id="estatusC" name="estatusC">
                                                        <option value="1">Activo</option>
                                                        <option value="0">Inactivo</option>
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                                <label for="carrera">Carrera</label>
                                                <div class="inpt-wrapper">
                                                    <select id="carrera" name="carrera">
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                        <button id="BuscarMaterias">Buscar</button>
                                        <button id="AgregarMaterias">Agregar</button>
                                    </div>
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>NOMBRE</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadoMaterias">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                                <label for="mgmaula">Aula</label>
                                                <div class="inpt-wrapper">
                                                    <select id="mgmaula" name="mgmaula">
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
                                                <label for="mgmmaestro">Encargado</label>
                                                <div class="inpt-wrapper">
                                                    <select id="mgmmaestro" name="mgmmaestro">
                                                    </select>
                                                    <div class="inpt-under"></div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                    <button id="GrupoGuardar" slot="footer">GUARDAR</button>
                                    
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
                                                <label for="mgmsemestre">Semestre</label>
                                                <div class="inpt-wrapper">
                                                    <select id="mgmsemestre" name="mgmsemestre"></select>
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
                                        <button id="AgregarGrupos">Agregar</button>
                                        <button id="ImportarGrupos">Importar desde excel</button>
                                    </div>
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>MATERIA</th>
                                                    <th>GRUPO</th>
                                                    <th>AULA</th>
                                                    <th>SEMESTRE</th>
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
                                   
                                </x-modal>
                                <x-modal id="mdlInsAlumno" size="sm" canclose="true">
                                    <div slot="title">Inscribir un alumno a un grupo</div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <div class="igrid-sm-12">
                                                <label for="iaMateria">Materia</label>
                                                <div class="inpt-wrapper">
                                                    <select id="iaMateria" name="iaMateria"></select>
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                            <div class="igrid-sm-12">
                                                <label for="iaGruposMateria">Grupo</label>
                                                <div class="inpt-wrapper">
                                                    <select name="iaGruposMateria" id="iaGruposMateria" disabled>
                                                        <option value="0">Seleccione la materia...</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="igrid-sm-12">
                                                <label for="iaMatricula">Matrícula</label>
                                                <div class="inpt-wrapper">
                                                    <input id="iaMatricula" type="text" name="iaMatricula"
                                                        placeholder="Matrícula...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                            <div class="igrid-sm-12">
                                                <label id="iaMensaje" style="color: firebrick;"></label>
                                            </div>
                                        </form>
                                    </div>
                                  
                                    <button id="btnInscribirAlumno" slot="footer">INSCRIBIR</button>
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

                                                <label for="mgmsemestregrupos">Semestre</label>
                                                <div class="inpt-wrapper">
                                                    <select id="mgmsemestregrupos" name="mgmsemestregrupos"></select>
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
                                                        onclick="return false;">Filtrar</button>
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
                                        <button id="btnMostrarInsAlumno">Inscribir Alumno</button>
                                        <button id="btnHorariosInscripcion">Horarios de inscripciones</button>
                                    </div>
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>MATRICULA</th>
                                                    <th>ALUMNO</th>
                                                    <th>MATERIA</th>
                                                    <th>GRUPO</th>
                                                    <th>AULA</th>
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
                                <div class="padder">
                                    <div class="block">
                                        <!-- Botones -->
                                        <div class="my-3">
                                            <button id="CrearTicket">Crear nuevo ticket</button>
                                            <button id="ExportarTickets">Exportar a excel</button>
                                        </div>
                                        <!-- Filtros -->
                                        <div class="row mb-4">
                                                <div class="col-8 text-right">
                                                    <form autocomplete="off">
                                                        <div class="text-left inpt-wrapper">
                                                            <label for="estado" class="text-white">Estado</label>
                                                            <div class="multiselect-container mb-2" id="estadoContainer"></div>
                                                            <button type="button" id="marcarTodoBtn"
                                                            class="small-btn mt-2">Marcar
                                                            Todo</button>
                                                            <button type="button" id="desmarcarTodoBtn"
                                                            class="small-btn mt-2">Desmarcar Todo</button>
                                                        </div>
                                                    </form>
                                                </div>
                                             </div>
                                    </div>
                                    <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
                                        <table class="table table-bordered table-striped">
                                            <thead class="">
                                                <tr>
                                                    <th style="position: sticky; top: 0;">
                                                        ACCIONES</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        N° TICKET</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        AULA</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        EQUIPO</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        DESCRIPCION</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        ESTADO</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        MOTIVO</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        CREADOR</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        FECHA DE CREACIÓN</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        FECHA DE CIERRE</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        MOTIVO DE CIERRE</th>
                                                    <th style="position: sticky; top: 0; ">
                                                        ADMINISTRADOR QUE CERRO EL TICKET</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadoTickets">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div slot="tabs" id="Aulas" class="container">
                            <div class="content">
                                <div class="row">
                                    <div class="col-6">
                                        <div id="filter-container" class="mb-3 ">
                                            <label>Filtrar por Estatus:</label>
                                            <div class="d-flex flex-wrap multiselect-container">
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadoa"
                                                        value="CONFIRMADO" checked>
                                                    <label class="form-check-label">Confirmado</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadoa"
                                                        value="CERRADO" checked>
                                                    <label class="form-check-label">Cerrado</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadoa"
                                                        value="APROBADA" checked>
                                                    <label class="form-check-label">Aprobada</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadoa"
                                                        value="RECHAZADA" checked>
                                                    <label class="form-check-label">Rechazada</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadoa"
                                                        value="PENDIENTE" checked>
                                                    <label class="form-check-label">Pendiente</label>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <button id="marcarTodoBtnAulas">Marcar Todos</button>
                                                <button id="desmarcarTodoBtnAulas">Desmarcar
                                                    Todos</button>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="fechaPrestamoAulas">Filtrar por Fecha de Préstamo:</label>
                                        <input type="date" id="fechaPrestamoAulas" class="" />
                                    </div>

                                </div>


                                <div class="row">
                                    <div class="col-6">
                                        <div id="filter-container" class="mb-3 ">
                                            <label for="aulasPrestamo">Filtrar por Aulas</label>
                                            <div class="inpt-wrapper">
                                                <select id="aulasPrestamo" name="aulasPrestamo">
                                                    <option value="">Todas las aulas</option>
                                                </select>
                                                <div class="inpt-under"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="horainicio">Filtrar por hora de inicio:</label>
                                        <select id="horainicioPrestamoAulas" class="swal2-input">
                                            <option value="">Todas las horas</option>
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
                                    </div>

                                </div>



                                <div class="padder">
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>CREADOR</th>
                                                    <th>PERFIL</th>
                                                    <th>N° SOLICITUD</th>
                                                    <th>AULA</th>
                                                    <th>FECHA DE CREACIÓN</th>
                                                    <th>FECHA DE PRÉSTAMO</th>
                                                    <th>HORA INICIO</th>
                                                    <th>HORA FIN</th>
                                                    <th>ESTATUS</th>
                                                    <th>ADMIN APROBADO </th>
                                                    <th>ADMIN CONFIRMADO </th>
                                                    <th>FECHA DE CONFIRMACIÓN</th>
                                                    <th>OBSERVACIONES</th>
                                                    <th>FECHA DE CIERRE</th>
                                                    <!-- <th>N° SOLICITUD</th>
                                                        <th>TIPO SOLICITUD</th>
                                                        <th>AULA</th>
                                                        <th>MÁQUINA</th>
                                                        <th>FECHA DE PRÉSTAMO</th>
                                                        <th>HORA INICIO</th>
                                                        <th>HORA FIN</th>
                                                        <th>ESTADO</th>
                                                        <th>FECHA DE CREACIÓN</th> -->
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadoAulas">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>



                        </div>

                        <div slot="tabs" id="Reportes" class="container">
                        <div class="content">
                                <div class="padder">
                                    <!-- Formulario de búsqueda -->
                                    <div class="sticky">
                                        <button id="BuscarReportesTickets">Reporte de Tickets </button>
                                        <button id="BuscarReportesMaterias">Reporte de Materias</button>
                                        <button id="ExportarReportes">Exportar en Excel</button>
                                    </div>

                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadoReportes">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div slot="tabs" id="ConfigAulas" class="container">
                            <div class="content">
                                <x-modal id="ModalAulas" size="md" canclose="true">
                                    <div slot="title">Agregar Aula</div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <input id="mid" type="hidden">
                                            <div class="igrid-sm-2">
                                                <label for="nombreAula">Nombre</label>
                                                <div class="inpt-wrapper">
                                                    <input id="nombreAula" type="text" name="mnombre"
                                                        placeholder="Nombre...">
                                                    <div class="inpt-under"></div>
                                                </div>

                                                <label for="capacidadAula">Capacidad de Alumnos</label>
                                                <div class="inpt-wrapper">
                                                    <input id="capacidadAula" type="number" name="mcapacidad" min="1">
                                                    <div class="inpt-under"></div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                    <button id="AgregarAula" slot="footer">AGREGAR</button>
                                  
                                </x-modal>

                                <div class="padder">
                                    <div class="sticky"
                                        style="display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; padding: 10px; z-index: 0;">
                                        <button id="CrearAula"
                                            style="padding: 10px 15px; font-size: 16px; margin: 0 5px; cursor: pointer;">Crear
                                            Aula</button>
                                        <button id="BuscarAulasA"
                                            style="padding: 10px 15px; font-size: 16px; margin: 0 5px; cursor: pointer;">Buscar
                                            Aulas Activas</button>
                                        <button id="BuscarAulasI"
                                            style="padding: 10px 15px; font-size: 16px; margin: 0 5px; cursor: pointer;">Buscar
                                            Aulas Inactivas</button>
                                        <button id="ConfigFechas"
                                            style="padding: 10px 15px; font-size: 16px; margin: 0 5px; cursor: pointer; margin-left: auto;">HORARIOS
                                            EXTRA</button>
                                    </div>
                                    <!-- Resultados de la búsqueda -->
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>NOMBRE DE AULA</th>
                                                    <th>CAPACIDAD</th>
                                                    <th>HORARIOS</th>
                                                    <th style="max-width: 4rem;">AULA PRESTABLE</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadosConfigAulas">
                                                <!-- Los resultados filtrados aparecerán aquí -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div slot="tabs" id="PrestamoEquipos" class="container">
                            <div class="content">
                            <div class="row">
                                    <div class="col-6">
                                        <div id="filter-container" class="mb-3 ">
                                            <label>Filtrar por Estatus:</label>
                                            <div class="d-flex flex-wrap multiselect-container">
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadop"
                                                        value="CONFIRMADO" checked>
                                                    <label class="form-check-label">Confirmado</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadop"
                                                        value="CERRADO" checked>
                                                    <label class="form-check-label">Cerrado</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadop"
                                                        value="APROBADA" checked>
                                                    <label class="form-check-label">Aprobada</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadop"
                                                        value="RECHAZADA" checked>
                                                    <label class="form-check-label">Rechazada</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox" name="estadop"
                                                        value="PENDIENTE" checked>
                                                    <label class="form-check-label">Pendiente</label>
                                                </div>
                                            </div>
                                            <div class="mt-2">
                                                <button id="marcarTodoBtnEquipos">Marcar Todos</button>
                                                <button id="desmarcarTodoBtnEquipos">Desmarcar
                                                    Todos</button>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="fechaPrestamoEquipos">Filtrar por Fecha de Préstamo:</label>
                                        <input type="date" id="fechaPrestamoEquipos" class="" />
                                    </div>

                                </div>


                                <div class="row">
                                    <div class="col-6">
                                        <label for="horainicio">Filtrar por hora de inicio:</label>
                                        <select id="horainicioPrestamoEquipos" class="swal2-input">
                                            <option value="">Todas las horas</option>
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
                                    </div>

                                </div>


                                <div class="padder">
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>CREADOR</th>
                                                    <th>PERFIL</th>
                                                    <th>N° SOLICITUD</th>
                                                    <th>AULA</th>
                                                    <th>FECHA DE CREACIÓN</th>
                                                    <th>FECHA DE PRÉSTAMO</th>
                                                    <th>HORA INICIO</th>
                                                    <th>HORA FIN</th>
                                                    <th>ESTATUS</th>
                                                    <th>ADMIN APROBADO </th>
                                                    <th>ADMIN CONFIRMADO </th>
                                                    <th>FECHA DE CONFIRMACIÓN</th>
                                                    <th>OBSERVACIONES</th>
                                                    <th>FECHA DE CIERRE</th>
                                                </tr>
                                            </thead>
                                            <tbody id="resultadosequipos">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div slot="tabs" id="Equipos" class="container">
                            <div class="content">
                                <x-modal id="ModalEquipo" size="md" canclose="true">
                                    <div slot="title">Agregar Equipo</div>
                                    <div class="padder">
                                        <form autocomplete="off">
                                            <input id="mid" type="hidden">
                                            <div class="igrid-sm-2">
                                                <label for="nombreEquipo">Nombre del Equipo</label>
                                                <div class="inpt-wrapper">
                                                    <input id="nombreEquipo" type="text" name="enombre"
                                                        placeholder="Nombre...">
                                                    <div class="inpt-under"></div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <button id="AgregarEquipo" slot="footer">AGREGAR</button>
                                   
                                </x-modal>

                                <div class="padder">
                                    <div class="sticky">
                                        <button id="CrearEquipo">Crear Equipo</button>
                                        <button id="BuscarEquipoA">Buscar Equipos Activos</button>
                                        <button id="BuscarEquipoI">Buscar Equipos Inactivos</button>
                                    </div>
                                    <!-- Resultados de la búsqueda -->
                                    <div class="table-overflow">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>ACCIONES</th>
                                                    <th>NOMBRE DEL EQUIPO</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadosConfigEquipos">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div slot="tabs" id="CalendarioAulas" class="container">
                            <?php include 'solicitar_aula_view.php' ?>
                        </div>

                    </x-tab>
                </div>
            </div>
            <div class="main-footer"><x-timer></x-timer></div>
        </div>
    </div>
    <div id="customDialog" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="customDialogLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="customDialogLabel">Aprobar Máquina</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="customDialogForm">
                        <div class="form-group">
                            <label for="inputAula">Aula:</label>
                            <input type="text" class="" id="inputAula" placeholder="Ingrese el Aula"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="inputMaquina">Máquina:</label>
                            <input type="text" class="" id="inputMaquina" placeholder="Ingrese la Máquina"
                                required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="confirmCustomDialog">Aprobar</button>
                </div>
            </div>
        </div>
    </div>

    <input id="last" type="text">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="jquery-3.6.0.min.js"></script>
    <script src="jquery.tabletoCSV.js"></script>
    <script type="module" src="main.js"></script>
    <script type="module" src="usuario.js"></script>
    <script type="module" src="materia.js"></script>
    <script type="module" src="grupo.js"></script>
    <script type="module" src="inscripciones.js"></script>
    <script type="module" src="js/ticketsAdmin.js"></script>
    <script type="module" src="js/aulasConfig.js"></script>
    <script type="module" src="js/equiposConfig.js"></script>
    <script type="module" src="js/reportes.js"></script>
    <script src="js/aulas_prestamo.js"></script>
    <script src="js/equipos_prestamo.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>

</html>