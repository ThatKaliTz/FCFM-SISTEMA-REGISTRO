<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "gruposmethods.php";
require_once "response.php";
session_start();
$error = !isset($_POST["data"]) || is_null(json_decode($_POST["data"]));
if ($error) {
    die(json_encode(new Response(true, "Error al obtener petición")));
}
$data = json_decode($_POST["data"]);
$type = $data->type;
switch ($type) {
    case "Query": ///Hace una busqueda de materias en la bd
        $materia = $data->materia;
        $nombre = $data->nombre;
        $dia = $data->dia;
        $horainicio = $data->horainicio;
        $horafin = $data->horafin;
        $semestre = $data->semestre;
        $idMaestro = isset($data->idMaestro) ? $data->idMaestro : 0;
        $result = QueryGrupos($materia, $nombre, $dia, $horainicio, $horafin, $idMaestro, $semestre);
        die(json_encode(new Response(false, $result)));
        break;
    case "Add": ///Agrega un grupo
        NoTienePermiso();
        $materia = $data->materia;
        $aula = $data->aula;
        $dia = $data->dia;
        $horainicio = $data->horainicio;
        $horafin = $data->horafin;
        $capacidad = $data->capacidad;
        $sesiones = $data->sesiones;
        $encargado = $data->encargado;
        if (GrupoExistente($materia, $dia, $horainicio, $horafin)) {
            die(json_encode(new Response(true, "Grupo ya existente")));
        } else {
            if (AddGrupo($materia, $aula, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado)) {
                die(json_encode(new Response(false, "Agregado")));
            } else {
                die(json_encode(new Response(true, "Error al agregar grupo")));
            }
        }
        break;
    case "Edit": ///Edita un grupo
        NoTienePermiso();
        $id = $data->id;
        $aula = $data->aula;
        $dia = $data->dia;
        $horainicio = $data->horainicio;
        $horafin = $data->horafin;
        $capacidad = $data->capacidad;
        $sesiones = $data->sesiones;
        $encargado = $data->encargado;
        if (EditGrupo($id, $aula, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado)) {
            die(json_encode(new Response(false, "Editado")));
        } else {
            die(json_encode(new Response(true, "Error al editar grupo")));
        }
        break;
    case "Delete": ///Elimina un grupo
        NoTienePermiso();
        $id = $data->id;
        if (DeleteGrupo($id)) {
            die(json_encode(new Response(false, "Eliminado")));
        } else {
            die(json_encode(new Response(true, "Error al eliminar grupo")));
        }
        break;
    case "Import":
        NoTienePermiso();
        $grupos = $data->grupos;
        $errores = ImportGrupos($grupos);
        if (count($errores) > 0) {
            die(json_encode(new Response(true, $errores)));
        } else {
            die(json_encode(new Response(false, "Grupos importados")));
        }
        break;
    case "Enroll":
        $id = $data->id;
        $usuarioid = $_SESSION["user"]["Id"];
        if (UsuarioGrupoExistente($usuarioid, $id)) {
            die(json_encode(new Response(true, "Ya se encuentra inscrito en el grupo")));
        } else if (UsuarioGrupoMateriaExistente($usuarioid, $id)) {
            die(json_encode(new Response(true, "Ya se encuentra inscrito a un grupo de esta materia")));
        } else {
            if (!HasCapacityGrupo($id)) {
                die(json_encode(new Response(true, "El grupo esta lleno")));
            } else {
                if (EnrollGrupo($usuarioid, $id)) {
                    die(json_encode(new Response(false, "Inscrito")));
                } else {
                    die(json_encode(new Response(true, "Error al inscribir al grupo")));
                }
            }
        }
        break;
    case "Adminenroll":
        $id = $data->inscripcion->idGrupo;
        $usuario = GetUsuarioByMatricula($data->inscripcion->matriculaAlumno);
        $idUsuario = $usuario["Id"];
        if (UsuarioGrupoExistente($idUsuario, $id)) {
            die(json_encode(new Response(true, "Ya se encuentra inscrito en el grupo")));
        } else if (UsuarioGrupoMateriaExistente($idUsuario, $id)) {
            die(json_encode(new Response(true, "Ya se encuentra inscrito a un grupo de esta materia")));
        } else {
            if (!HasCapacityGrupo($id)) {
                die(json_encode(new Response(true, "El grupo esta lleno")));
            } else {
                if (EnrollGrupo($idUsuario, $id)) {
                    die(json_encode(new Response(false, "Inscrito")));
                } else {
                    die(json_encode(new Response(true, "Error al inscribir al grupo")));
                }
            }
        }
        break;
    case "Unroll":
        $id = $data->id;
        $usuarioid = $_SESSION["user"]["Id"];
        if (UnrollGrupo($usuarioid, $id)) {
            die(json_encode(new Response(false, "Se a desinscrito del grupo")));
        } else {
            die(json_encode(new Response(true, "Error al desinscribir del grupo")));
        }
        break;
    case "Adminunroll":
        $id = $data->idGrupo;
        $usuario = GetUsuarioByMatricula($data->matriculaAlumno);
        $idUsuario = $usuario["Id"];
        if (UnrollGrupo($idUsuario, $id)) {
            die(json_encode(new Response(false, "Se a desinscrito del grupo")));
        } else {
            die(json_encode(new Response(true, "Error al desinscribir del grupo")));
        }
        break;
    case "QueryUsuario":
        $usuarioid = $_SESSION["user"]["Id"];
        $materia = $data->materia;
        $nombre = $data->nombre;
        $dia = $data->dia;
        $horainicio = $data->horainicio;
        $horafin = $data->horafin;
        $semestre = $data->semestre; 
        $result = QueryUsuarioGrupos($usuarioid, $materia, $nombre, $dia, $horainicio, $horafin, null, 0, 0, $semestre);
        die(json_encode(new Response(false, $result)));
        break;
    case "QueryGruposPorAlumno":
        $materia = $data->materia;
        $nombre = $data->nombre;
        $dia = $data->dia;
        $horainicio = $data->horainicio;
        $horafin = $data->horafin;
        $matricula = $data->matricula;
        $grupoId = $data->grupo;
        $semestre = $data->semestre;
        $idMaestro = isset($data->idMaestro) ? $data->idMaestro : 0;
        $result = QueryUsuarioGrupos(0, $materia, $nombre, $dia, $horainicio, $horafin, $matricula, $grupoId, $idMaestro, $semestre);
        die(json_encode(new Response(false, $result)));
        break;
    case "QueryGruposMateria":
        $perfil = $_SESSION["user"]["PerfilId"];
        $userid = $_SESSION["user"]["Id"];
        $idMateria = $data->idMateria;
        $semestre = $data->semestre;
        $result = QueryGruposMateria($idMateria, $semestre, $userid, $perfil);
        die(json_encode(new Response(false, $result)));
        break;
    case "QuerySesiones":
        $grupoId = $data->grupoId;
        $result = QuerySesiones($grupoId);
        die(json_encode(new Response(false, $result)));
        break;
    case "Calificar":
        $result = CalificarAlumno($data->sesion);
        die(json_encode(new Response(false, $result)));
        break;
    case "GetSemestres": 
        $result = QuerySemestres();
        die(json_encode(new Response(false, $result)));
        break;
    default:
        die(json_encode(new Response(true, "Proceso" . $type . "desconocido...")));
        break;
}
