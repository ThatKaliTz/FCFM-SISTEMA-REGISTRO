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
        $result = GetSolicitudesNew();
        die(json_encode(new Response(false, $result)));
        break;
    case "GetPorUsuario":
        $usuario_actual = $_SESSION["user"]["Id"];
        $result = GetSolicitudesPorUsuario($usuario_actual);
        die(json_encode(new Response(false, $result)));
        break;
    case "Add":
        $fecha = $data->fecha;
        $horaInicio = $data->horaInicio;
        $horaFin = $data->horaFin;
        $creador = $_SESSION["user"]["Id"];
        $idAula = $data->id;
        $mensaje = AddSolicitud($idAula, $creador, $fecha, $horaInicio, $horaFin, );
        if (strpos($mensaje, 'Error') !== false) {
            die(json_encode(new Response(true, $mensaje)));
        } else {
            die(json_encode(new Response(false, $mensaje)));
        }
        break;

    case "Delete": ///Elimina un Solicitud
        // NoTienePermiso();
        $id = $data->idSolicitud;
        if (DeleteSolicitud($id)) {
            die(json_encode(new Response(false, "Solicitud eliminada correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al eliminar la solicitud")));
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
    case "ConfirmarPrestamo":
        $id = $data->idSolicitud;
        if (ConfirmarAulaSolicitud($id)) {
            die(json_encode(new Response(false, "Se ha confirmado exitosamente el prestamo")));
        } else {
            die(json_encode(new Response(true, "Error al confirmar el prestamo de aula")));
        }
        break;
    case "CerrarPrestamo":
        $id = $data->idPrestamo;
        $anomalia = $data->anomalia;
        $observaciones = $data->observaciones;
        error_log($observaciones);
        if (CerrarPrestamoAula($id, $anomalia, $observaciones)) {
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
        $result = GetCountSolicitudes($id, $fecha, $horaInicio, $horaFin);
        die(json_encode(new Response(false, $result)));        
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
