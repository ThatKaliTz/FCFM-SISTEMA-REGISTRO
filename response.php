<?php
class Response
{
    public $error = false;
    public $data = null;
    function __construct($error, $data)
    {
        $this->error = $error;
        $this->data = $data;
    }
}

function NoTienePermiso() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION["user"])) {
        // Imprimir en el log el contenido de la sesión

        // Permitir acceso solo a los perfiles 1 y 5
        if ($_SESSION["user"]["PerfilId"] != 1 && $_SESSION["user"]["PerfilId"] != 5 && $_SESSION["user"]["PerfilId"] != 6) {
            die(json_encode(new Response(true, "No tiene permiso")));
        }
    } else {
        error_log("No hay usuario en la sesión.");
    }
}

function NoTienePermiso2() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION["user"])) {
        $perfilId = $_SESSION["user"]["PerfilId"];

        // Permitir acceso a los perfiles 1, 2 y 5
        if ($perfilId != 1 && $perfilId != 2 && $perfilId != 5 && $perfilId != 6) {
            die(json_encode(new Response(true, "No tiene permiso")));
        }
    }
}
?>