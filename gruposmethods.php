<?php
require_once "materiasmethods.php";
function QueryGrupos($materia, $nombre, $dia, $horainicio, $horafin, $idMaestro, $semestre)
{

    $materia = $materia == "T" ? null : $materia;
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryGrupo(1000, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssis", $materia, $nombre, $dia, $horainicio, $horafin, $idMaestro, $semestre);

    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $grupos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $grupos[] = $row;
        }
    }
    return $grupos;
}
function GrupoExistente($materia, $dia, $horainicio, $horafin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetGrupoExistente(?, ?, ?, ?)");
    $stmt->bind_param("isss", $materia, $dia, $horainicio, $horafin);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
}
function AddGrupo($materia, $aula, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AddGrupo(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssiii", $materia, $aula, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function AddGrupoConNombre($materia, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado, $nombre)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AddGrupoConNombre(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssiiis", $materia, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado, $nombre);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function EditGrupo($id, $aula, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call EditGrupo(?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssiii", $id, $aula, $dia, $horainicio, $horafin, $capacidad, $sesiones, $encargado);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function DeleteGrupo($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DeleteGrupo(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function GetDia($dia)
{
    $empiezacon = substr($dia, 0, 2);
    if ($empiezacon === "LU") {
        return "LU";
    }
    if ($empiezacon === "MA") {
        return "MA";
    }
    if ($empiezacon === "MI") {
        return "MI";
    }
    if ($empiezacon === "JU") {
        return "JU";
    }
    if ($empiezacon === "VI") {
        return "VI";
    }
    if ($empiezacon === "SA") {
        return "SA";
    }
    if ($empiezacon === "DO") {
        return "DO";
    }
    return "LU"; ///Por default los coloca el lunes
}
///Nombre de la materia, Dia (Lunes, Martes, etc.), Hora inicio (formato 24hrs), Hora fin (formato 24hrs)
function ImportGrupos($grupos)
{
    $errores = [];
    $sinerrores = [];
    $materiaId = null; // Almacenará el ID de la materia del grupo
    $materiaActual = ""; // Almacenará el nombre de la materia del grupo

    // Abre un archivo de log para registrar los eventos
    $logFile = fopen("import_grupos.log", "a");
    fwrite($logFile, "==== Inicio de Importación ====\n");

    for ($i = 0; $i < count($grupos); $i++) {
        fwrite($logFile, "Procesando grupo $i: " . json_encode($grupos[$i]) . "\n");
        $grupo = $grupos[$i];
        $materia = trim(strtoupper($grupo[0])); // Nombre de la materia
        $dia = GetDia(trim(strtoupper($grupo[1]))); // Día de la materia
        $horainicio = str_replace(":", "", $grupo[2]);
        $horainicio = strlen($horainicio) < 4 ? "0" . $horainicio : $horainicio;
        $horafin = str_replace(":", "", $grupo[3]);
        $horafin = strlen($horafin) < 4 ? "0" . $horafin : $horafin;
        $capacidad = trim($grupo[4]); // Límite
        $capacidad = strlen($capacidad) <= 0 ? "0" : $capacidad;

        fwrite($logFile, "Materia: $materia, Día: $dia, Hora inicio: $horainicio, Hora fin: $horafin, Capacidad: $capacidad\n");

        if ($materia != $materiaActual) {
            $materiaActual = $materia;
            $mat = MateriaPorNombre($materia);
            if ($mat == null) {
                AddMateria($materia);
                $mat = MateriaPorNombre($materia);
                if ($mat == null) {
                    fwrite($logFile, "Error: No se pudo agregar o recuperar la materia $materia\n");
                    $errores[] = "Error al agregar o recuperar la materia $materia";
                    continue;
                }
            }
            $materiaId = $mat["Id"];
            fwrite($logFile, "Materia $materia asignada al ID: $materiaId\n");
        }

        if (GrupoExistente($materiaId, $dia, $horainicio, $horafin)) {
            $errores[] = "Ya existe un grupo para la materia " . $materiaActual . " el día " . $dia . " de " . $grupo[2] . " - " . $grupo[3];
            fwrite($logFile, "Grupo ya existente: " . end($errores) . "\n");
        } else {
            if (array_key_exists(5, $grupo)) {
                // Contiene la columna de nombres de grupo?
                if (!AddGrupoConNombre($materiaId, $dia, $horainicio, $horafin, $capacidad, 0, 0, trim($grupo[5]))) {
                    $errores[] = "Error al agregar el grupo para la materia " . $materiaActual . " el día " . $dia . " de " . $grupo[2] . " - " . $grupo[3];
                    fwrite($logFile, "Error al agregar grupo con nombre: " . end($errores) . "\n");
                } else {
                    $sinerrores[] = "Se agregó el grupo para la materia " . $materiaActual . " el día " . $dia . " de " . $grupo[2] . " - " . $grupo[3];
                    fwrite($logFile, "Grupo agregado con éxito: " . end($sinerrores) . "\n");
                }
            } else {
                if (!AddGrupo($materiaId, 0, $dia, $horainicio, $horafin, $capacidad, 0, 0)) {
                    $errores[] = "Error al agregar el grupo para la materia " . $materiaActual . " el día " . $dia . " de " . $grupo[2] . " - " . $grupo[3];
                    fwrite($logFile, "Error al agregar grupo: " . end($errores) . "\n");
                } else {
                    $sinerrores[] = "Se agregó el grupo para la materia " . $materiaActual . " el día " . $dia . " de " . $grupo[2] . " - " . $grupo[3];
                    fwrite($logFile, "Grupo agregado con éxito: " . end($sinerrores) . "\n");
                }
            }
        }
    }

    $final[] = "Se guardaron " . count($sinerrores) . " de " . (count($errores) + count($sinerrores));
    fwrite($logFile, "==== Fin de Importación ====\n");
    fclose($logFile);

    return array_merge($final, array_merge($errores, $sinerrores));
}

function UsuarioGrupoMateriaExistente($usuarioid, $id) {
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetUsuarioGrupoMateria(?, ?)");
    $stmt->bind_param("ii", $usuarioid, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
}

function UsuarioGrupoExistente($usuarioid, $id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetUsuarioGrupo(?, ?)");
    $stmt->bind_param("ii", $usuarioid, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
}
function HasCapacityGrupo($id)
{
    $ret = false;
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call HasCapacity(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    if ($success) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $ret = $row["Hascapacity"];
        }
    }
    $stmt->close();
    $mysqli->close();
    return $ret;
}
function EnrollGrupo($usuarioid, $id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AddUsuarioGrupo(?, ?)");
    $stmt->bind_param("ii", $usuarioid, $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function UnrollGrupo($usuarioid, $id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DeleteUsuarioGrupo(?, ?)");
    $stmt->bind_param("ii", $usuarioid, $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
function QueryUsuarioGrupos($usuarioid, $materia, $nombre, $dia, $horainicio, $horafin, $matricula = null, $grupoId = 0, $idMaestro = 0, $semestre = "NA")
{
    $materia = $materia == "T" ? null : $materia;
    $matricula = empty($matricula) ? null : $matricula;
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call QueryUsuarioGrupo(99999, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissssiiis", $usuarioid, $materia, $nombre, $dia, $horainicio, $horafin, $matricula, $grupoId, $idMaestro, $semestre);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $grupos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $grupos[] = $row;
        }
    }

    return $grupos;
}

function QueryGruposMateria($idMateria, $semestre, $userid, $perfil)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call Grupos_Materia(?,?,?,?)");
    $stmt->bind_param("isii", $idMateria, $semestre, $userid, $perfil);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $grupos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $grupos[] = $row;
        }
    }
    return $grupos;
}
function GetUsuarioByMatricula($matricula)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetUsuarioMatricula(?)");
    $stmt->bind_param("i", $matricula);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $usuario = null;
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $usuario = $row;
            break;
        }
    }
    return $usuario;
}
function QuerySesiones($grupoId)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call sesiones(?)");
    $stmt->bind_param("i", $grupoId);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $sesiones = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $sesiones[] = $row;
        }
    }
    return $sesiones;
}
function CalificarAlumno($sesion)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call Sesion_Calificacion(?, ?, ?, ?)");
    $stmt->bind_param("iiid", $sesion->UsuarioId, $sesion->GrupoId, $sesion->Sesion, $sesion->Asistio);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function QuerySemestres()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerSemestresDisponibles()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $semestres = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $semestres[] = $row;
        }
    }
    return $semestres;
}

