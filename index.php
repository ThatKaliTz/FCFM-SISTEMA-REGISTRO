<?php
session_start();
if (isset($_SESSION["user"])) {
    if ($_SESSION["user"]["PerfilId"] == 1) {
        header('Location: main.php');
    } else {
        header('Location: register.php');
    }
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="icons/style.css"> !-->
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="grid.css">
    <title>INICIAR SESIÓN</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <div id="wrapper" class="main-wrapper theme09">
        <div class="main-form">
            <div id="login">
                <div class="card-wrapper">
                    <div class="card-container">
                        <div class="card-header">
                            <h3>SISTEMA DE REGISTRO</h3>
                        </div>
                        <div class="card-body">
                            <div class="padder">
                                <div class="grid">
                                    <form autocomplete="off">
                                        <label for="matricula">Matrícula</label>
                                        <div class="inpt-wrapper">
                                            <input id="matricula" type="text" name="matricula" placeholder="Matrícula">
                                            <div class="inpt-under"></div>
                                        </div>
                                        <label for="contraseña">Contraseña</label>
                                        <div class="inpt-wrapper">
                                            <input id="contraseña" type="password" name="contraseña" placeholder="Contraseña">
                                            <div class="inpt-under"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button id="btnLogin" class="wave">Iniciar sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="module" src="ind.js"></script>
</body>

</html>