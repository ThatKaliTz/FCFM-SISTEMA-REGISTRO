<?php
require_once "../connection.php";

function AddEquipo($nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL InsertarEquipo(?)");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $mensaje['mensaje']; 
}


function GetEquipos()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerEquiposActivos()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Equipos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Equipos[] = $row;
        }
    }
    return $Equipos;
}


function GetEquiposInactivos()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerEquiposInactivos()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Equipos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Equipos[] = $row;
        }
    }
    return $Equipos;
}


function DesactivarEquipo($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DesactivarEquipo(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function ReactivarEquipo($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ReactivarEquipo(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function EditarEquipo($id, $nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL EditarEquipo(?, ?)");
    $stmt->bind_param("is", $id, $nombre);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $mensaje['mensaje']; 
}






