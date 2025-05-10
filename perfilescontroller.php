<?php
    header("Content-Type: application/json; charset=UTF-8");
    require_once "perfilesmethods.php";
    require_once "response.php";

    $error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
    if($error){
        die(json_encode(new Response(true, "Error al obtener petición")));
    }
    $data = json_decode($_POST["data"]);
    $type = $data->type;
    switch($type){
        case "Query": ///Hace una busqueda de perfiles en la bd
            $nombre = $data->nombre;
            $result = QueryPerfiles($nombre);
            die(json_encode(new Response(false, $result)));
        break;
        case "Add": ///Agrega un perfil
            NoTienePermiso();
            $nombre = $data->nombre;
            if(AddPerfil($nombre)){
                die(json_encode(new Response(false, "Agregado")));
            }
            else{
                die(json_encode(new Response(true, "Error al agregar perfil")));
            }
        break;
        case "Edit": ///Edita un perfil
            NoTienePermiso();
            $id = $data->id;
            $nombre = $data->nombre;
            if(EditPerfil($id, $nombre)){
                die(json_encode(new Response(false, "Editado")));
            }
            else{
                die(json_encode(new Response(true, "Error al editar perfil")));
            }
        break;
        case "Delete": ///Elimina un perfil
            NoTienePermiso();
            $id = $data->id;
            if(DeletePerfil($id)){
                die(json_encode(new Response(false, "Eliminado")));
            }
            else{
                die(json_encode(new Response(true, "Error al eliminar perfil")));
            }
        break;
        default:
            die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
    }
?>