<?php
require_once "../connection.php";
function GetAulas()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerAulasActivas()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Aulas = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Aulas[] = $row;
        }
    }
    return $Aulas;
}

function GetAulasInactivas()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerAulasInactivas()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Aulas = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Aulas[] = $row;
        }
    }
    return $Aulas;
}


function GetAulasPrestables()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerAulasPrestablesActivas()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Aulas = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Aulas[] = $row;
        }
    }
    return $Aulas;
}


function GetHorariosClases(): array
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL ObtenerConfiguracion()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Configuracion = [];
    if ($result->num_rows > 0) {
        $Configuracion = $result->fetch_assoc(); 
    }
    return $Configuracion;
}


function GetHorarios($idAula)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerHorariosAula(?)");
    $stmt->bind_param("i", $idAula);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Horarios = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Horarios[] = $row;
        }
    }
    return $Horarios;
}

function GetHorariosPrestamo()
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ObtenerHorarios()");
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $mysqli->close();
    $Horarios = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $Horarios[] = $row;
        }
    }
    return $Horarios;
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



function AddSolicitud($aula, $fecha, $horaInicio, $horaFin, $creador, $tipo)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL AddSolicitud(?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssis", $aula, $fecha, $horaInicio, $horaFin, $creador, $tipo);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function AddAula($nombre, $capacidad)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL InsertarAula(?, ?)");
    $stmt->bind_param("si", $nombre, $capacidad);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $mensaje['mensaje']; 
}



function EditarAula($id, $nombre, $capacidad)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL EditarAula(?, ?, ?)");
    $stmt->bind_param("isi", $id, $nombre, $capacidad);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $mensaje['mensaje']; 
}


function ActualizarFechaClases($fechaInicio, $fechaFin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL ActualizarConfiguracion(?, ?)");
    $stmt->bind_param("ss", $fechaInicio, $fechaFin);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}


function PrestamoAulaBooleano($id, $prestamo)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL PrestamoAulaBool(?, ?)");
    $stmt->bind_param("ii", $id, $prestamo);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $mensaje['mensaje']; 
}





function AddHorario($aula, $dia, $horaInicio, $horaFin)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("CALL InsertarHorario(?, ?, ?, ?)");
    $stmt->bind_param("isss",$aula, $dia, $horaInicio, $horaFin);
    $stmt->execute();
    $result = $stmt->get_result();
    $mensaje = $result->fetch_assoc();
    $stmt->close();
    $mysqli->close();
    return $mensaje['mensaje']; 
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
function DesactivarAula($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call DesactivarAula(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}

function ReactivarAula($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call ReactivarAula(?)");
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
function AprobarAulaSolicitud($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call AprobarAulaSolicitud(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
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

function DesactivarHorario($id)
{
    $mysqli = getConnection();
    $stmt = $mysqli->prepare("call EliminarHorario(?)");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();
    $mysqli->close();
    return $success;
}
