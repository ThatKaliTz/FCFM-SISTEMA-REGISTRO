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
    else if ($_SESSION["user"]["PerfilId"] == 6) {
        // header('Location: soportemain.php');;
    }
    $idsesion = $_SESSION["user"]["PerfilId"];
    
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
    <link rel="shortcut icon" href="http://www.fcfm.uanl.mx/sites/all/themes/temaFCFM/img/fcfm.ico" type="image/vnd.microsoft.icon">
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
                                    <input id="correo" name="correo" type="text" value="<?= trim($_SESSION["user"]["Correo"]) ?>" placeholder="Correo...">
                                    <!-- <label for="contraseña">El formato de correo debe ser el siguiente: nombre.apellido@uanl.edu.mx </label> -->
                                    <div class="inpt-under"></div>

                                </div>

                            </div>
                            <div class="igrid-m-4">
                                <label for="contraseña">El formato de correo debe ser el siguiente: nombre.apellido@uanl.edu.mx </label>
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
                                    <input id="contraseña" name="contraseña" type="password" placeholder="Contraseña...">
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
                    <div slot="header">Bienvenido Soporte <?= $_SESSION["user"]["Nombre"] ?></div>
                    <div slot="footer"></div>
                    <div id="logout" class="menu-option wave">CERRAR SESIÓN</div>
                    <div id="perfil" class="menu-option wave">PERFIL</div>
                </x-menu>

                <div class="main-content">
                    <x-tab main>
                        <?php if (preg_match($formatoAntiguo, $input) || preg_match($formatoActual, $input)) { ?>
                            <div slot="items" class="tab-item wave" ref="Tickets">TICKETS</div>

                            <div slot="tabs" id="Tickets" class="container">
                            <div class="content">
                                <div class="padder">
                                    <div class="sticky">
                                        <form autocomplete="off">
                                            <div class="igrid-sm-2 igrid-md-3 igrid-lg-4">
                                                <div class="inpt-wrapper">
                                                    <label for="estado">Estado</label>
                                                    <div class="multiselect-container" id="estadoContainer"></div>
                                                    <button type="button" id="marcarTodoBtn" class="small-btn">Marcar
                                                        Todo</button>
                                                    <button type="button" id="desmarcarTodoBtn"
                                                        class="small-btn">Desmarcar Todo</button>
                                                </div>
                                            </div>
                                        </form>

                                        <!-- <button id="AgregarAlumnos">Agregar</button> -->
                                        <button id="CrearTicket">Crear nuevo ticket</button>

                                    </div>
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
                                                    <th>MOTIVO</th>
                                                    <th>CREADOR</th>
                                                    <th>FECHA DE CREACIÓN</th>
                                                    <th>FECHA DE CIERRE</th>
                                                    <th>MOTIVO DE CIERRE</th>
                                                    <th>ADMINISTRADOR QUE CERRO EL TICKET</th>
                                                </tr>
                                            </thead>
                                            <tbody id="ResultadoTickets">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
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
    <script type="module" src="register.js"></script>
    <script type="module" src="js/ticketsSoporte.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>

</html>