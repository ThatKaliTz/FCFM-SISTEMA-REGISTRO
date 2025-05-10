<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../methods/reportesMethods.php";
require_once "../response.php";


$data = json_decode(file_get_contents("php://input"));
$type = $data->type;

switch ($type) {
    case "QueryTickets": 
        $result = QueryTicketsReportes();
        die(json_encode(new Response(false, $result)));
        break;
    case "QueryMaterias": 
        $result = QueryTicketsMaterias();
        die(json_encode(new Response(false, $result)));
        break;

    default:
        die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
}
