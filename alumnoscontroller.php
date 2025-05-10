<?php
    header("Content-Type: application/json; charset=UTF-8");
    require_once "alumnosmethods.php";
    require_once "response.php";
    try{
        $data = json_decode($_POST["data"]);
        $type = $data->type;
        switch($type){
            case "Query": ///Hace una busqueda de alumnos en la bd
                NoTienePermiso();
                $matricula = $data->matricula;
                $nombre = $data->nombre;
                $primerap = $data->primerap;
                $segundoap = $data->segundoap;
                $perfil = $data->perfil;
                $estatus = isset($data->estatus) ? $data->estatus : 1;
                $baneados = isset($data->baneados) ? $data->baneados : 0;
                
                setcookie("ESTATUS", $estatus, time() + (86400 * 1), "/");
                setcookie("BANEADOS", $baneados, time() + (86400 * 1), "/");
                $result = QueryAlumnos($matricula, $nombre, $primerap, $segundoap, $perfil, $estatus, $baneados);
                die(json_encode(new Response(false, $result)));
            break;
            case "QueryUsuariosEncargados": 
                NoTienePermiso();
                $result = QueryUsuariosEncargados();
                die(json_encode(new Response(false, $result)));
            break;
            case "Add": ///Agrega un alumno
                NoTienePermiso();
                $matricula = $data->matricula;
                $nombre = $data->nombre;
                $primerap = $data->primerap;
                $segundoap = $data->segundoap;
                $correo = $data->correo;
                $perfil = $data->perfil;
                if(MatriculaExistente($matricula)){
                    die(json_encode(new Response(true, "Matrícula ya en uso")));
                }
                else{
                    if(AddAlumno($matricula, $nombre, $primerap, $segundoap, $correo, $perfil)){
                        die(json_encode(new Response(false, "Agregado")));
                    }
                    else{
                        die(json_encode(new Response(true, "Error al agregar alumno")));
                    }
                }
            break;
            case "Edit": ///Edita un alumno
                NoTienePermiso();
                $id = $data->id;
                $nombre = $data->nombre;
                $primerap = $data->primerap;
                $segundoap = $data->segundoap;
                $correo = $data->correo;
                $perfil = $data->perfil;
                if(EditAlumno($id, $nombre, $primerap, $segundoap, $correo, $perfil)){
                    die(json_encode(new Response(false, "Editado")));
                }
                else{
                    die(json_encode(new Response(true, "Error al editar alumno")));
                }
            break;
            case "Ban": ///Banea un alumno
                NoTienePermiso();
                $id = $data->id;
                $motivoBaneo = $data->mmotivobaneo;
                if(BanAlumno($id, $motivoBaneo)){
                    die(json_encode(new Response(false, "Alumno Baneado")));
                }
                else{
                    die(json_encode(new Response(true, "Error al banear alumno")));
                }
            break;
            case "Desban": ///Desbano a un alumno
                NoTienePermiso();
                $id = $data->id;
                $motivoDesbaneo = $data->mmotivodesbaneo;
                if(DesbanAlumno($id, $motivoDesbaneo)){
                    die(json_encode(new Response(false, "Alumno Desbaneado")));
                }
                else{
                    die(json_encode(new Response(true, "Error al banear alumno")));
                }
            break;
            case "Delete": ///Elimina un alumno
                NoTienePermiso();
                $id = $data->id;
                if(DeleteAlumno($id)){
                    die(json_encode(new Response(false, "Eliminado")));
                }
                else{
                    die(json_encode(new Response(true, "Error al eliminar alumno")));
                }
            break;
            case "Import":
                NoTienePermiso();
                $alumnos = $data->alumnos;
                $formato = $data->formato;
                $errores = ImportAlumnos($alumnos, $formato);
                if(count($errores) > 0){
                    die(json_encode(new Response(true, $errores)));
                }
                else{
                    die(json_encode(new Response(false, "Alumnos importados")));
                }
            break;
            case "ChangeEmail":
                session_start();
                $usuarioid = $_SESSION["user"]["Id"];
                $correo = $data->correo;
                if(ChangeCorreo($usuarioid, $correo)){
                    $_SESSION["user"]["Correo"] = $correo;
                    die(json_encode(new Response(false, "Correo guardado")));
                }
                else{
                    die(json_encode(new Response(true, "Error al guardar correo")));
                }
            break;
            case "ChangePassword":
                session_start();
                $usuarioid = $_SESSION["user"]["Id"];
                $contraseña = $data->contraseña;
                if(ChangeContraseña($usuarioid, $contraseña)){
                    die(json_encode(new Response(false, "Contraseña guardada")));
                }
                else{
                    die(json_encode(new Response(true, "Error al guardar contraseña")));
                }
            case "ChangePasswordForOtherUser":
                session_start();
                $usuarioid = $data->id;
                $contraseña = $data->contraseña;
                if(ChangeContraseña($usuarioid, $contraseña)){
                    die(json_encode(new Response(false, "Contraseña guardada")));
                }
                else{
                    die(json_encode(new Response(true, "Error al guardar contraseña")));
                }
            break;
            case "Restaurar": ///Restaura la contraseña del alumno
                NoTienePermiso();
                $id = $data->id;
                $matricula = $data->matricula;
                if(ChangeContraseña($id, $matricula)){
                    die(json_encode(new Response(false, "Contraseña restaurada")));
                }
                else{
                    die(json_encode(new Response(true, "Error al restaurar contraseña")));
                }
            break;
            default:
                throw new Exception("Tipo de petición no válida");
            break;
        }
    }catch (Exception $e) {
        echo json_encode(new Response(true, $e->getMessage()));
    }
    $error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
    if($error){
        die(json_encode(new Response(true, "Error al obtener petición")));
    }
?>