<?php
require_once "../connection.php";
function GetSolicitudes()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetAllSolicitudes()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Solicitudes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Solicitudes[] = $row;
        }
    }
    return $Solicitudes;
}

function GetSolicitudesNew()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerDetallesPrestamosAulas()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Solicitudes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Solicitudes[] = $row;
        }
    }
    return $Solicitudes;
}


function GetSolicitudesPrestamoEquipos()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerDetallesPrestamosEquipos()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Solicitudes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Solicitudes[] = $row;
        }
    }
    return $Solicitudes;
}


function GetSolicitudesPorUsuario($usuario_actual)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetSolicitudes(?)");
    $stmt->bind_param("i", $usuario_actual);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Solicitudes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Solicitudes[] = $row;
        }
    }
    return $Solicitudes;
}


function GetSolicitudesEquiposPorUsuario($usuario_actual)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call GetSolicitudesEquiposUsuario(?)");
    $stmt->bind_param("i", $usuario_actual);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Solicitudes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Solicitudes[] = $row;
        }
    }
    return $Solicitudes;
}

// function QueryMateriasC($nombre, $carrera)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call QueryMateria(100, ?, ?)");
//     $stmt->bind_param("ss", $nombre, $carrera);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
//     $mysqli->close();
//     $materias = [];
//     if ($result->num_rows > 0) {
//         while ($row = $result->fetch_assoc()) {
//             $materias[] = $row;
//         }
//     }
//     return $materias;
// }

// function MateriaExistente($nombre)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call GetMateriaNombre(?)");
//     $stmt->bind_param("s", $nombre);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
//     $mysqli->close();
//     return ($result->num_rows > 0); /// SI RETORNA FILAS, ES QUE YA EXISTE
// }
// function MateriaPorNombre($nombre)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call GetMateriaNombre(?)");
//     $stmt->bind_param("s", $nombre);
//     $stmt->execute();
//     $result = $stmt->get_result();
//     $stmt->close();
//     $mysqli->close();
//     return ($result->num_rows > 0) ? $result->fetch_assoc() : null; /// SI RETORNA FILAS, ES QUE YA EXISTE
// }

function VerificarSolapamiento($fecha, $horaInicio, $horaFin, $aula, $tipo)
{
    // Verificar si el tipo de solicitud es "Aula"
    if ($tipo != "Aula") {
        return false; // No es necesario validar el solapamiento
    }

    $mysqli = getConnection();
    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM Solicitud WHERE fecha_solicitud = ? AND aula_solicitud = ? AND ((hora_inicio_solicitud >= ? AND hora_inicio_solicitud < ?) OR (hora_fin_solicitud > ? AND hora_fin_solicitud <= ?) OR (? >= hora_inicio_solicitud AND ? <= hora_fin_solicitud))");
    $stmt->bind_param("ssssssss", $fecha, $aula, $horaInicio, $horaFin, $horaInicio, $horaFin, $horaInicio, $horaFin);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    $mysqli->close();
    return $count > 0;
}

function AddSolicitud($idAula, $creador, $fecha, $horaInicio, $horaFin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL AddSolicitud(?, ?, ?, ?, ?)");
    $stmt->bind_param("iisss", $idAula, $creador, $fecha, $horaInicio, $horaFin);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result === false) {
        $error = $mysqli->error;
        $stmt->close();
        $mysqli->close();
        return $error;  
    }
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();

    return $mensaje ? $mensaje['mensaje'] : "Solicitud enviada correctamente.";
}

function AddSolicitudEquipo($idEquipo, $creador, $horaInicio, $horaFin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL AltaPrestamoEquipo(?, ?, ?, ?)");
    $stmt->bind_param("iiss", $idEquipo, $creador, $horaInicio, $horaFin);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result === false) {
        $error = $mysqli->error;
        $stmt->close();
        $mysqli->close();
        return $error;  
    }

    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();

    return $mensaje ? $mensaje['mensaje'] : "Solicitud enviada correctamente.";
}

// function EditMateria($id, $nombre)
// {
//     $mysqli = getConnection();
//     $stmt = $mysqli->prepare("call EditMateria(?, ?)");
//     $stmt->bind_param("is", $id, $nombre);
//     $success = $stmt->execute();
//     $stmt->close();
//     $mysqli->close();
//     return $success;
// }
function DeleteSolicitud($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DeleteSolicitud(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

function DeleteSolicitudEquipo($id)
{
    error_log($id);
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DeleteSolicitudEquipo(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

function RechazarSolicitud($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call RechazarSolicitud(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function RechazarSolicitudEquipo($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call RechazarSolicitudEquipo(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function AprobarAulaSolicitud($id)
{
    $usuarioid = $_SESSION["user"]["Id"];
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AprobarAulaSolicitud(?, ?)");
    $stmt->bind_param("ii", $id, $usuarioid);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

function AprobarEquipoSolicitud($id)
{
    $usuarioid = $_SESSION["user"]["Id"];
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AprobarEquipoSolicitud(?, ?)");
    $stmt->bind_param("ii", $id, $usuarioid);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function ConfirmarAulaSolicitud($id)
{
    $usuarioid = $_SESSION["user"]["Id"];
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ConfirmarAulaSolicitud(?, ?)");
    $stmt->bind_param("ii", $id, $usuarioid);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function ConfirmarEquipoSolicitud($id)
{
    $usuarioid = $_SESSION["user"]["Id"];
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ConfirmarEquipoSolicitud(?, ?)");
    $stmt->bind_param("ii", $id, $usuarioid);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function CerrarPrestamoAula($id, $anomalia, $observaciones)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call CerradoAulaSolicitud(?, ?, ?)");
    $stmt->bind_param("isi", $id, $observaciones, $anomalia);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function CerrarPrestamoEquipo($id, $anomalia, $observaciones)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call CerradoPrestamoSolicitud(?, ?, ?)");
    $stmt->bind_param("isi", $id, $observaciones, $anomalia);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

function GetCountSolicitudes($id_aula, $fecha, $hora_inicio, $hora_fin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL ObtenerCountSolicitudes(?, ?, ?, ?)");
    
    if ($stmt === false) {
        error_log("Error en la preparación de la consulta: " . $mysqli->error);
        return false; 
    }

    // Log del query con los valores que se van a enviar
    $queryLog = sprintf(
        "CALL ObtenerCountSolicitudes(%d, '%s', '%s', '%s')",
        $id_aula,
        $mysqli->real_escape_string($fecha),
        $mysqli->real_escape_string($hora_inicio),
        $mysqli->real_escape_string($hora_fin)
    );
    error_log("Query ejecutado: " . $queryLog);

    $stmt->bind_param("isss", $id_aula, $fecha, $hora_inicio, $hora_fin);

    $success = $stmt->execute();
    
    if ($success) {
        $result = $stmt->get_result();
        $data = $result->fetch_assoc(); 
    } else {
        error_log("Error en la ejecución de la consulta: " . $stmt->error);
        $data = false; 
    }

    $stmt->close();
    $mysqli->close();
    return $data; 
}




function AprobarMaquinaSolicitud($id, $aula, $maquina)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AprobarMaquinaSolicitud(?, ?, ?)");
    $stmt->bind_param("iss", $id, $aula, $maquina);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
