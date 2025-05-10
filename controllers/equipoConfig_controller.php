<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "../methods/aulasConfigMethods.php";
require_once "../methods/equiposConfigMethods.php";
require_once "../response.php";

$data = json_decode(file_get_contents("php://input"));
$type = $data->type;


switch ($type) {
    case "Get":
        $result = GetEquipos();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetInactivos":
        $result = GetEquiposInactivos();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetAulasPrestables":
        $result = GetAulasPrestables();
        die(json_encode(new Response(false, $result)));
        break;
    case "DesactivarEquipo":
        $id = $data->idSolicitud;
        if (DesactivarEquipo($id)) {
            die(json_encode(value: new Response(false, "Equipo desactivado correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al desactivar el equipo")));
        }
        break;
    case "ReactivarEquipo":
        $id = $data->idSolicitud;
        if (ReactivarEquipo($id)) {
            die(json_encode(new Response(false, "Equipo reactivado correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al reactivar el equipo")));
        }
        break;
    case "EditarEquipo":
        $id = $data->id;
        $nombre = $data->nombre;
        $mensaje = EditarEquipo($id, $nombre);
        if (strpos($mensaje, 'Error') !== false) {
            die(json_encode(new Response(true, $mensaje)));
        } else {
            die(json_encode(new Response(false, $mensaje)));
        }
        break;
    case "TogglePrestable":
        $id = $data->id;
        $prestamo = $data->prestable;
        if (PrestamoAulaBooleano($id, $prestamo)) {
            die(json_encode(new Response(false, "Estatus del Aula cambiado correctamente")));
        } else {
            die(json_encode(new Response(true, "Ha ocurrido un error, favor de contactar a soporte")));
        }
        break;
    case "Decline":
        $id = $data->idSolicitud;
        if (RechazarSolicitud($id)) {
            die(json_encode(new Response(false, "Solicitud rechazada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al rechazar la solicitud")));
        }
        break;
    case "AprobarAula":
        $id = $data->idSolicitud;
        if (AprobarAulaSolicitud($id)) {
            die(json_encode(new Response(false, "Solicitud de aula aprobada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al aprobar el aula")));
        }
        break;
    case "AprobarMaquina":
        $id = $data->idSolicitud;
        $aula = $data->aula;
        $maquina = $data->maquina;
        if (AprobarMaquinaSolicitud($id, $aula, $maquina)) {
            die(json_encode(new Response(false, "Solicitud de máquina aprobada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al aprobar la máquina")));
        }
        break;
    case "AgregarEquipo":
        $nombreEquipo = $data->nombre;
        $mensaje = AddEquipo($nombreEquipo);
        if (strpos($mensaje, 'Error') !== false) {
            die(json_encode(new Response(true, $mensaje)));
        } else {
            die(json_encode(new Response(false, $mensaje)));
        }
        break;
    case "AgregarHorario":
        $aula = $data->id;
        $dia = $data->dia;
        $horaInicio = $data->horaInicio;
        $horaFin = $data->horaFin;
        error_log("AgregarHorario - Aula: $aula, Día: $dia, Hora Inicio: $horaInicio, Hora Fin: $horaFin");
        $mensaje = AddHorario($aula, $dia, $horaInicio, $horaFin);
        if (strpos($mensaje, 'Error') !== false) {
            die(json_encode(new Response(true, $mensaje)));
        } else {
            die(json_encode(new Response(false, $mensaje)));
        }
        break;
    case "GetHorarios":
        $idAula = $data->id;
        $result = GetHorarios($idAula);
        die(json_encode(new Response(false, $result)));
        break;
    case "GetHorariosPrestamo":
        $result = GetHorariosPrestamo();
        die(json_encode(new Response(false, $result)));
        break;
    case "EliminarHorario":
        $id = $data->id;
        if (DesactivarHorario($id)) {
            die(json_encode(value: new Response(false, "Horario eliminado correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al eliminar horario")));
        }
        break;

    default:
        die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
}
