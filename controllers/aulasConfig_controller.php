<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "../methods/aulasConfigMethods.php";
require_once "../response.php";

$data = json_decode(file_get_contents("php://input"));
$type = $data->type;


switch ($type) {
    case "Get":
        $result = GetAulas();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetInactivas":
        $result = GetAulasInactivas();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetAulasPrestables":
        $result = GetAulasPrestables();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetHorariosClases":
        $result = GetHorariosClases();
        die(json_encode(new Response(false, $result)));
        break;
    case "DesactivarAula":
        $id = $data->idSolicitud;
        if (DesactivarAula($id)) {
            die(json_encode(value: new Response(false, "Aula desactivada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al desactivar el aula")));
        }
        break;
    case "ReactivarAula":
        $id = $data->idSolicitud;
        if (ReactivarAula($id)) {
            die(json_encode(new Response(false, "Aula reactivada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al reactivar el aula")));
        }
        break;
    case "EditarAula":
        $id = $data->id;
        $nombre = $data->nombre;
        $capacidad = $data->capacidad;
        $mensaje = EditarAula($id, $nombre, $capacidad);
        if (strpos($mensaje, 'Error') !== false) {
            die(json_encode(new Response(true, $mensaje)));
        } else {
            die(json_encode(new Response(false, $mensaje)));
        }
        break;
    case "actualizarFechasClases":
        $fechaInicio = $data->fechaInicio;
        $fechaFin = $data->fechaFin;
        if (ActualizarFechaClases($fechaInicio, $fechaFin)) {
            die(json_encode(new Response(false, "Se han actualizado las fechas de las clases, ahora las fechas particulares terminaran en: " . $fechaFin)));
        } else {
            die(json_encode(new Response(true, "Ha ocurrido un error, favor de contactar a soporte")));
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
    case "AgregarAula":
        $aula = $data->nombre;
        $cantidad = $data->capacidad;
        $mensaje = AddAula($aula, $cantidad);
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
