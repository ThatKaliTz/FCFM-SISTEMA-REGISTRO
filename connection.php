<?php
function getConnection()
{
    $server = "localhost";
    $database = "siste133_sistemaregistro_dev";
    // $user = "siste133_bec3";
    // $password = "siste133_sistemaregistro";
    $user = 'root';
    $password = '';

    
    // $database = "siste133_sistemaregistro";
    // $user = "siste133_root";
    // $password = "siste133_sistemaregistro";

    // mysqli_report(MYSQLI_REPORT_STRICT | MYSQLI_REPORT_ALL);
    //        mysqli_report(MYSQLI_REPORT_STRICT);
    try {
        $mysqli = new mysqli($server, $user, $password, $database);
    } catch (Exception $ex) {
        die("Error de conexión");
    }
    return $mysqli;
}
                                                    