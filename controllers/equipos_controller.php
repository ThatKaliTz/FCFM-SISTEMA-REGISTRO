<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "../methods/solicitudesMethods.php";
require_once "../response.php";

// $error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
// if ($error) {
//     die(json_encode(new Response(true, "Error al obtener petición")));
// }
// $data = json_decode($_POST["data"]);
$data = json_decode(file_get_contents("php://input"));
$type = $data->type;
switch ($type) {
    case "Get":
        $result = GetSolicitudes();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetNew":
        $result = GetSolicitudesPrestamoEquipos();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetPorUsuario":
        $usuario_actual = $_SESSION["user"]["Id"];
        $result = GetSolicitudesEquiposPorUsuario($usuario_actual);
        die(json_encode(new Response(false, $result)));
        break;
    case "Add":
        $horaInicio = $data->horaInicio;
        $horaFin = $data->horaFin;
        $creador = $_SESSION["user"]["Id"];
        $idEquipo = $data->id;
        $mensaje = AddSolicitudEquipo($idEquipo, $creador, $horaInicio, $horaFin, );
        if (strpos($mensaje, 'Error') !== false) {
            die(json_encode(new Response(true, $mensaje)));
        } else {
            die(json_encode(new Response(false, $mensaje)));
        }
        break;
    case "Delete": 
        $id = $data->idSolicitud;
        error_log($id);
        if (DeleteSolicitudEquipo($id)) {
            die(json_encode(new Response(false, "Solicitud eliminada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al eliminar la solicitud")));
        }
        break;
    case "DeclineEquipo":
        $id = $data->idSolicitud;
        if (RechazarSolicitudEquipo($id)) {
            die(json_encode(new Response(false, "Solicitud rechazada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al rechazar la solicitud")));
        }
        break;
    case "AprobarEquipo":
        $id = $data->idSolicitud;
        if (AprobarEquipoSolicitud($id)) {
            die(json_encode(new Response(false, "Solicitud de equipo aprobada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al aprobar la solicitud")));
        }
        break;
    case "ConfirmarPrestamoEquipo":
        $id = $data->idSolicitud;
        if (ConfirmarEquipoSolicitud($id)) {
            die(json_encode(new Response(false, "Se ha confirmado exitosamente el prestamo de equipo")));
        } else {
            die(json_encode(new Response(true, "Error al confirmar el prestamo de equipo")));
        }
        break;
    case "CerrarPrestamoEquipo":
        $id = $data->idPrestamo;
        $anomalia = $data->anomalia;
        $observaciones = $data->observaciones;
        error_log($observaciones);
        if (CerrarPrestamoEquipo($id, $anomalia, $observaciones)) {
            die(json_encode(new Response(false, "Se ha confirmado exitosamente el prestamo")));
        } else {
            die(json_encode(new Response(true, "Error al confirmar el prestamo de aula")));
        }
        break;
    case "GetCountSolicitudes":
        $id = $data->id_aula;
        $fecha = $data->fecha;
        $horaInicio = $data->hora_inicio;
        $horaFin = $data->hora_fin;
        if (GetCountSolicitudes($id, $fecha, $horaInicio, $horaFin)) {
            die(json_encode(new Response(false, "Se ha confirmado exitosamente el prestamo")));
        } else {
            die(json_encode(new Response(true, "Error al confirmar el prestamo de aula")));
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

    default:
        die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
}
