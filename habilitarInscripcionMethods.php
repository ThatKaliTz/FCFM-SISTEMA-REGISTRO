<?php
require_once "connection.php";
function QueryFechasInscripcion()
{
    // $matricula = empty($matricula) ? null : $matricula;
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL GetFechasInscripcion();");
    // $stmt->bind_param("isssi", $matricula, $nombre, $primerap, $segundoap, $perfil);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $fechasInscripcion = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $fechasInscripcion[] = $row;
        }
    }
    return $fechasInscripcion;
}


function ActualizarFechaInscripcion($fechaInicio, $fechaFin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL ActualizarFechaInscripcion(?, ?)");
    $stmt->bind_param("ss", $fechaInicio, $fechaFin);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

