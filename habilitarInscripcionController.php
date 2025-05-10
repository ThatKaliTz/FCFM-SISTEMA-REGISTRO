<?php
    header("Content-Type: application/json; charset=UTF-8");
    require_once "habilitarInscripcionMethods.php";
    require_once "response.php";
    
    // Obtener datos JSON desde el flujo de entrada
    $inputData = file_get_contents("php://input");
    $data = json_decode($inputData);
    
    $error = !$data || !isset($data->type);
    
    if ($error) {
        die(json_encode(new Response(true, "Error al obtener petición")));
    }
    $type = $data->type;
    switch($type){
        case "Query": ///Hace una busqueda de fechas en la bd
            // $nombre = $data->nombre;
            $result = QueryFechasInscripcion();
            if (!$result) {
                die(json_encode(new Response(true, "Error al consultar fechas de inscripción")));
            }
            die(json_encode(new Response(false, $result)));
        break;
        case "SetHorarioInscripcion":
            $fechaInicio = $data->fecha_inicio;
            $fechaFin = $data->fecha_fin;
            if (ActualizarFechaInscripcion($fechaInicio, $fechaFin)) {
                die(json_encode(new Response(false, "Se han actualizado las fechas de las inscripciones, ahora la fecha de inscripción terminaran en: \n " . $fechaFin)));
            } else {
                die(json_encode(new Response(true, "Ha ocurrido un error, favor de contactar a soporte")));
            }
            break;
        // case "Add": ///Agrega un materia
        //     NoTienePermiso();
        //     $nombre = $data->nombre;
        //     if(MateriaExistente($nombre)){
        //         die(json_encode(new Response(true, "Nombre de materia ya en uso")));
        //     }
        //     else{
        //         if(AddMateria($nombre)){
        //             die(json_encode(new Response(false, "Agregada")));
        //         }
        //         else{
        //             die(json_encode(new Response(true, "Error al agregar materia")));
        //         }
        //     }
        // break;
        // case "Edit": ///Edita un materia
        //     NoTienePermiso();
        //     $id = $data->id;
        //     $nombre = $data->nombre;
        //     if(EditMateria($id, $nombre)){
        //         die(json_encode(new Response(false, "Editada")));
        //     }
        //     else{
        //         die(json_encode(new Response(true, "Error al editar materia")));
        //     }
        // break;
        // case "Delete": ///Elimina un materia
        //     NoTienePermiso();
        //     $id = $data->id;
        //     if(DeleteMateria($id)){
        //         die(json_encode(new Response(false, "Eliminada")));
        //     }
        //     else{
        //         die(json_encode(new Response(true, "Error al eliminar materia")));
        //     }
        // break;
        default:
            die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
    }
?>