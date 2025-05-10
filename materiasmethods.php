<?php
require_once "connection.php";
function QueryMaterias()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryMaterias()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $materias = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $materias[] = $row;
        }
    }
    return $materias;
}

function GetCarreras()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerCarreras()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $carreras = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $carreras[] = $row;
        }
    }
    return $carreras;
}



function QueryMateriasC($nombre, $idCarrera, $activo)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryMateria(?, ?, ?)");
    $stmt->bind_param("sii", $nombre, $idCarrera, $activo);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $materias = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $materias[] = $row;
        }
    }
    return $materias;
}

function MateriaExistente($nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetMateriaNombre(?)");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
}
function MateriaPorNombre($nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetMateriaNombre(?)");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    return ($result->num_rows > 0) ? $result->fetch_assoc() : null; /// SI RETORNA FILAS, ES QUE YA EXISTE
}
function AddMateria($nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AddMateria(?)");
    $stmt->bind_param("s", $nombre);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function EditMateria($id, $nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call EditMateria(?, ?)");
    $stmt->bind_param("is", $id, $nombre);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function DeleteMateria($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DeleteMateria(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

function ReactivarMateria($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ReactivarMateria(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
