<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "materiasmethods.php";
require_once "response.php";

$error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
if ($error) {
    die(json_encode(new Response(true, "Error al obtener petición")));
}
$data = json_decode($_POST["data"]);
$type = $data->type;
switch ($type) {
    case "GetCarreras": ///Obtiene las carreras del sistema 
        $result = GetCarreras();
        die(json_encode(new Response(false, $result)));
        break;
    case "Query":
        $result = QueryMaterias();
        die(json_encode(new Response(false, $result)));
        break;
    case "QueryC": ///Hace una busqueda de materias en la bd
        $nombre = $data->nombre;
        $idCarrera = $data->carreraId;
        $activo = $data->estatusValue;
        $result = QueryMateriasC($nombre, $idCarrera, $activo);
        die(json_encode(new Response(false, $result)));
        break;
    case "Add": ///Agrega un materia
        NoTienePermiso();
        $nombre = $data->nombre;
        if (MateriaExistente($nombre)) {
            die(json_encode(new Response(true, "Nombre de materia ya en uso")));
        } else {
            if (AddMateria($nombre)) {
                die(json_encode(new Response(false, "Agregada")));
            } else {
                die(json_encode(new Response(true, "Error al agregar materia")));
            }
        }
        break;
    case "Edit": ///Edita un materia
        NoTienePermiso();
        $id = $data->id;
        $nombre = $data->nombre;
        if (EditMateria($id, $nombre)) {
            die(json_encode(new Response(false, "Editada")));
        } else {
            die(json_encode(new Response(true, "Error al editar materia")));
        }
        break;
    case "Delete": ///Elimina un materia
        NoTienePermiso();
        $id = $data->id;
        if (DeleteMateria($id)) {
            die(json_encode(new Response(false, "Eliminada")));
        } else {
            die(json_encode(new Response(true, "Error al eliminar materia")));
        }
        break;
    case "Reactivar": ///Reactivar un materia
        NoTienePermiso();
        $id = $data->id;
        if (ReactivarMateria($id)) {
            die(json_encode(new Response(false, "Reactivada")));
        } else {
            die(json_encode(new Response(true, "Error al reactivar la materia")));
        }
        break;
    default:
        die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
}
