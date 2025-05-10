<?php
require_once "../connection.php";
function QueryTicketsReportes()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ReporteTicketsPorSemestre()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $reportes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reportes[] = $row;
        }
    }
    return $reportes;
}

function QueryTicketsMaterias()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ReporteAlumnosPorMateria()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $reportes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reportes[] = $row;
        }
    }
    return $reportes;
}
