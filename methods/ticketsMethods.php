<?php
require_once "../connection.php";
function QueryTickets()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryTicket()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $tickets = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $tickets[] = $row;
        }
    }
    return $tickets;
}

function QueryTicketsSoporte()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryTicketSoporte()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $tickets = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $tickets[] = $row;
        }
    }
    return $tickets;
}
function QueryTicketsMaestro($maestro)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryTicketMaestro(?)");
    $stmt->bind_param("i", $maestro);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $tickets = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $tickets[] = $row;
        }
    }
    return $tickets;
}

// function QueryMateriasC($nombre, $carrera)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call QueryMateria(100, ?, ?)");
//     $stmt->bind_param("ss", $nombre, $carrera);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
//     $mysqli->close();
//     $materias = [];
//     if ($result->num_rows > 0) {
//         while ($row = $result->fetch_assoc()) {
//             $materias[] = $row;
//         }
//     }
//     return $materias;
// }

// function MateriaExistente($nombre)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call GetMateriaNombre(?)");
//     $stmt->bind_param("s", $nombre);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
//     $mysqli->close();
//     return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
// }
// function MateriaPorNombre($nombre)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call GetMateriaNombre(?)");
//     $stmt->bind_param("s", $nombre);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
//     $mysqli->close();
//     return ($result->num_rows > 0) ? $result->fetch_assoc() : null; /// SI RETORNA FILAS, ES QUE YA EXISTE
// }
function AddTicket($aula, $equipo, $descripcion, $creador)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AddTicket(?, ?, ?, ?)");
    $stmt->bind_param("sisi", $aula, $equipo, $descripcion, $creador);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
// function EditMateria($id, $nombre)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call EditMateria(?, ?)");
//     $stmt->bind_param("is", $id, $nombre);
//     $success = $stmt->execute();
//     $stmt->close();
//     $mysqli->close();
//     return $success;
// }
function DeleteTicket($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DeleteTicket(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function ProcesarTicket($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ProcesarTicket(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function CerrarTicket($id, $motivo)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call CerrarTicket(?, ?, ?)");
    $idAdmin = $_SESSION["user"]["Id"];
    $stmt->bind_param("isi", $id, $motivo, $idAdmin);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function RechazarTicket($id, $motivo)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call RechazarTicket(?, ?)");
    $stmt->bind_param("is", $id, $motivo);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function AprobarTicket($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AprobarTicket(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function TicketToSoporte($id, $soporte)
{
    error_log($id);
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ToggleSoporte(?,?)");
    $stmt->bind_param("ii", $id, $soporte);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
