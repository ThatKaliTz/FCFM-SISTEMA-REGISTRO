<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../methods/ticketsMethods.php";
require_once "../response.php";

$error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
if ($error) {
    die(json_encode(new Response(true, "Error al obtener petición")));
}
$data = json_decode($_POST["data"]);
$type = $data->type;
switch ($type) {
    case "Query": ///Hace una busqueda de tickets en la bd
        // $nombre = $data->nombre;
        $result = QueryTickets();
        die(json_encode(new Response(false, $result)));
        break;
    case "QuerySoporte": ///Hace una busqueda de tickets en la bd
        $result = QueryTicketsSoporte();
        die(json_encode(new Response(false, $result)));
        break;
    case "QueryMaestro": ///Hace una busqueda de tickets en la bd por maestro
        // $nombre = $data->nombre;
        NoTienePermiso2();
        $idMaestro = intval($_SESSION["user"]["Id"]);
        $result = QueryTicketsMaestro($idMaestro);
        die(json_encode(new Response(false, $result)));
        break;
    case "Add": ///Agrega un materia
        NoTienePermiso2();
        $aula = $data->aula;
        $equipo = $data->equipo;
        $descripcion = $data->descripcion;
        // if (MateriaExistente($nombre)) {
        //     die(json_encode(new Response(true, "Nombre de materia ya en uso")));
        // } else {

        $result = AddTicket($aula, $equipo, $descripcion, $_SESSION["user"]["Id"]);
        if ($result) {
            die(json_encode(new Response(false, "Ticket enviado correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al enviar el ticket, intente de nuevo")));
        }
        // }
        break;
    // case "Edit": ///Edita un materia
    //     NoTienePermiso();
    //     $id = $data->id;
    //     $nombre = $data->nombre;
    //     if (EditMateria($id, $nombre)) {
    //         die(json_encode(new Response(false, "Editada")));
    //     } else {
    //         die(json_encode(new Response(true, "Error al editar materia")));
    //     }
    //     break;
    case "Delete": ///Elimina un ticket
        NoTienePermiso();
        $id = $data->id;
        if (DeleteTicket($id)) {
            die(json_encode(new Response(false, "Ticket eliminado correctamente")));
        } else {
            die(json_encode(new Response(true, "Error al eliminar el ticket")));
        }
        break;
    case "Procesar": ///Procesa un ticket
        NoTienePermiso();
        $id = $data->id;
        if (ProcesarTicket($id)) {
            die(json_encode(new Response(false, "Ticket en proceso")));
        } else {
            die(json_encode(new Response(true, "Error al procesar el ticket")));
        }
        break;
    case "Cerrar": ///Cerrar un ticket
        NoTienePermiso();
        $id = $data->id;
        $motivo = $data->motivo;
        if (CerrarTicket($id, $motivo)) {
            die(json_encode(new Response(false, "Ticket cerrado con éxito")));
        } else {
            die(json_encode(new Response(true, "Error al cerrar el ticket")));
        }
        break;
    case "Rechazar": ///Rechazar un ticket
        NoTienePermiso2();
        $id = $data->id;
        $motivo = $data->motivo;
        if (RechazarTicket($id, $motivo)) {
            die(json_encode(new Response(false, "Ticket rechazado con éxito")));
        } else {
            die(json_encode(new Response(true, "Error al rechazar el ticket")));
        }
        break;
    case "Aprobar": ///Aprobar un ticket
        NoTienePermiso2();
        $id = $data->id;
        if (AprobarTicket($id)) {
            die(json_encode(new Response(false, "Ticket aprobado con éxito")));
        } else {
            die(json_encode(new Response(true, "Error al aprobar el ticket")));
        }
        break;
    case "ToggleSoporte":
        error_log('ENTRE AL CONTROLADOR DEE TOGGLE SOPORTE');
        $id = $data->id;
        $soporte = $data->soporte;
        if (TicketToSoporte($id, $soporte)) {
            die(json_encode(new Response(false, "Se ha modificado exitosamente el ticket")));
        } else {
            die(json_encode(new Response(true, "Ha ocurrido un error, favor de contactar a soporte")));
        }
        break;

    default:
        die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
}
