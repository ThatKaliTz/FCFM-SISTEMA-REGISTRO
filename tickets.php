<?php
session_start();
if (isset($_SESSION["user"])) {
    if ($_SESSION["user"]["PerfilId"] != 1 && $_SESSION["user"]["PerfilId"] != 2 && $_SESSION["user"]["PerfilId"] != 5) {
        header('Location: register');
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
    <title>Dar de Alta Ticket</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="css/tickets.css">

</head>

<body>
    <form id="altaDeTicket">
        <h2>Dar de Alta Ticket</h2>
        <p>Bienvenido, <strong><?php echo $_SESSION["user"]["Nombre"]; ?></strong>
            </br>Recuerde que debe rellenar <strong>todos los campos</strong> correctamente.
            </br>Se debe crear <strong>un ticket por equipo</strong>.
            </br>Los tickets que abarquen más de 1 equipo <strong>serán descartados inmediatamente.</strong></p>


        <label for="aulas">Aula</label>
        <div class="inpt-wrapper">
            <select id="aulas" name="aulas">
            </select>
            <div class="inpt-under"></div>
        </div>

        <br>

        <label for="equipo">Equipo:</label>
        <input type="number" id="equipo" name="equipo" required placeholder="Número de equipo. Ej. 03" min="1"><br><br>

        <label for="descripcion">Descripción del requerimiento:</label>
        <textarea id="descripcion" name="descripcion" rows="4" cols="50" required maxlength="255"
            placeholder="Descripción del requerimiento."></textarea><br><br>

        <input type="submit" value="Enviar Ticket">
        <hr>
        <input type="button" value="Cancelar y volver" id="Cancelar">
    </form>


    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>
    <script src="jquery-3.6.0.min.js"></script>
    <script type="module" src="js/tickets.js"></script>



</body>

</html>