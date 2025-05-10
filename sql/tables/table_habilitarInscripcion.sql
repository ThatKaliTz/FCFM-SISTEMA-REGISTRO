USE siste133_sistemaregistro_dev;




DELIMITER ;

CREATE TABLE Ticket (
id_ticket INT NOT NULL UNIQUE AUTO_INCREMENT,
aula_ticket VARCHAR(10) NOT NULL,
equipo_ticket INT NOT NULL,
descripcion_requerimiento_ticket VARCHAR(255) NOT NULL,
estado_ticket VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
creador_ticket INT NOT NULL,
fecha_alta_ticket TIMESTAMP NOT NULL DEFAULT NOW(),
fecha_cambio_ticket TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
activo_ticket INT NOT NULL DEFAULT 1,

PRIMARY KEY (id_ticket)
);

DELIMITER ;;
CREATE PROCEDURE AddTicket(
    IN _aula_ticket VARCHAR(10),
    IN _equipo_ticket INT,
    IN _descripcion_requerimiento_ticket VARCHAR(255),
    IN _creador_ticket INT
)
BEGIN
    INSERT INTO Ticket (aula_ticket, equipo_ticket, descripcion_requerimiento_ticket, creador_ticket)
    VALUES (_aula_ticket, _equipo_ticket, _descripcion_requerimiento_ticket, _creador_ticket);
END;; 
DELIMITER ;

DELIMITER ;;
-- Verificar si el procedimiento almacenado existe
DROP PROCEDURE IF EXISTS QueryTicket ;;

CREATE PROCEDURE QueryTicket()
BEGIN
SET lc_time_names = 'es_ES';
SELECT 
    t.id_ticket AS Id,
    t.aula_ticket AS Aula,
    t.equipo_ticket AS Equipo,
    t.descripcion_requerimiento_ticket AS Descripcion,
    t.estado_ticket AS Estado,
    t.motivo_ticket AS Motivo,
    CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS Creador,
    CONCAT(
    DATE_FORMAT(t.fecha_alta_ticket, '%e de '), 
    CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 2))),
    DATE_FORMAT(t.fecha_alta_ticket, ', %Y a las %h:%i '), 
    LOWER(DATE_FORMAT(t.fecha_alta_ticket, '%p'))
) AS FechaCreacion

FROM 
    Ticket t
JOIN
    Usuario u ON t.creador_ticket = u.Id
WHERE 
    t.activo_ticket = 1
ORDER BY 
        t.fecha_alta_ticket DESC;  -- Ordenar por Id de manera descendente

END;; 
DELIMITER ;

DELIMITER ;;

CREATE PROCEDURE QueryTicketMaestro(
	IN _id_maestro INT
)
BEGIN

SELECT 
    t.id_ticket AS Id,
    t.aula_ticket AS Aula,
    t.equipo_ticket AS Equipo,
    t.descripcion_requerimiento_ticket AS Descripcion,
    t.estado_ticket AS Estado
FROM 
    Ticket t
WHERE 
    t.creador_ticket = _id_maestro;


END;; 
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE DeleteTicket(
	IN _id_ticket INT
)
BEGIN
    UPDATE Ticket SET activo_ticket = 0 WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;

DELIMITER ;;
DROP PROCEDURE IF EXISTS ProcesarTicket ;;
CREATE PROCEDURE ProcesarTicket(
	IN _id_ticket INT
)
BEGIN
    UPDATE Ticket
    SET estado_ticket = 'EN PROCESO', fecha_empieza_proceso = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;

DELIMITER ;;
DROP PROCEDURE IF EXISTS CerrarTicket ;;
CREATE PROCEDURE CerrarTicket(
	IN _id_ticket INT
)
BEGIN
    UPDATE Ticket
    SET estado_ticket = 'CERRADO', fecha_cerrado = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE RechazarTicket(
	IN _id_ticket INT,
    IN _motivo_ticket VARCHAR(100)
)
BEGIN
    UPDATE Ticket
    SET motivo_ticket = _motivo_ticket, estado_ticket = 'RECHAZADO', fecha_negado = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE AprobarTicket(
	IN _id_ticket INT
)
BEGIN
    UPDATE Ticket
    SET estado_ticket = 'APROBADO', fecha_aceptado = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;






DELIMITER ;;
CREATE PROCEDURE `QueryUsuarioGrupo`(
IN `_Cantidad` INT, 
IN `_UsuarioId` INT, 
IN `_MateriaId` INT, 
IN `_Nombre` VARCHAR(128), 
IN `_Dia` VARCHAR(128), 
IN `_HoraInicio` VARCHAR(32), 
IN `_HoraFin` VARCHAR(32), 
IN `_Matricula` INT, 
IN `_GrupoId` INT, 
IN `_MaestroId` INT)
    READS SQL DATA
SELECT M.Nombre AS Materia, G.Nombre as Nombre, G.Aula as Aula, G.Dia AS Dia, G.HoraInicio AS HoraInicio, 
G.HoraFin AS HoraFin, G.Id AS Id, concat_ws(' ', U.Nombre, U.ApPaterno, U.ApMaterno) AS Alumno, U.Matricula AS Matricula FROM UsuarioGrupo AS UG
    LEFT JOIN Grupo AS G ON UG.GrupoId=G.Id
    LEFT JOIN Materia AS M ON G.MateriaId = M.Id
    LEFT JOIN Usuario AS U ON UG.UsuarioId=U.Id
    WHERE 
    (UG.UsuarioId=_UsuarioId OR _UsuarioId=0) AND
    (G.MateriaId=_MateriaId OR _MateriaId IS NULL) AND
    (G.Nombre LIKE CONCAT("%", _Nombre, "%") OR _Nombre="") AND
    (G.Dia = _Dia OR _Dia="TS") AND
    (G.HoraInicio >= _HoraInicio) AND
    (G.HoraFin <= _HoraFin) AND
    (U.Matricula LIKE CONCAT("%", _Matricula, "%") OR _Matricula IS null) AND
    (UG.GrupoId=_GrupoId OR _GrupoId=0) AND
    (G.MaestroId = _MaestroId OR _MaestroId=0) AND G.Activo = 1
    LIMIT _Cantidad ;;
DELIMITER ;

-- Nueva version

USE siste133_sistemaregistro_dev;

DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS AddTicket;;
CREATE PROCEDURE AddTicket(
    IN _aula_ticket VARCHAR(10),
    IN _equipo_ticket INT,
    IN _descripcion_requerimiento_ticket VARCHAR(255),
    IN _creador_ticket INT
)
BEGIN
    INSERT INTO Ticket (aula_ticket, equipo_ticket, descripcion_requerimiento_ticket, creador_ticket)
    VALUES (_aula_ticket, _equipo_ticket, _descripcion_requerimiento_ticket, _creador_ticket);
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS QueryTicket;;
CREATE PROCEDURE QueryTicket()
BEGIN
    SET lc_time_names = 'es_ES';
    SELECT 
        t.id_ticket AS Id,
        t.aula_ticket AS Aula,
        t.equipo_ticket AS Equipo,
        t.descripcion_requerimiento_ticket AS Descripcion,
        t.estado_ticket AS Estado,
        t.motivo_ticket AS Motivo,
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS Creador,
        CONCAT(
            DATE_FORMAT(t.fecha_alta_ticket, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 2))),
            DATE_FORMAT(t.fecha_alta_ticket, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_alta_ticket, '%p'))
        ) AS FechaCreacion
    FROM 
        Ticket t
    JOIN
        Usuario u ON t.creador_ticket = u.Id
    WHERE 
        t.activo_ticket = 1
    ORDER BY 
        t.fecha_alta_ticket DESC;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS QueryTicketMaestro;;
CREATE PROCEDURE QueryTicketMaestro(
    IN _id_maestro INT
)
BEGIN
    SELECT 
        t.id_ticket AS Id,
        t.aula_ticket AS Aula,
        t.equipo_ticket AS Equipo,
        t.descripcion_requerimiento_ticket AS Descripcion,
        t.estado_ticket AS Estado
    FROM 
        Ticket t
    WHERE 
        t.creador_ticket = _id_maestro;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS DeleteTicket;;
CREATE PROCEDURE DeleteTicket(
    IN _id_ticket INT
)
BEGIN
    UPDATE Ticket SET activo_ticket = 0 WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS ProcesarTicket;;
CREATE PROCEDURE ProcesarTicket(
    IN _id_ticket INT
)
BEGIN
    UPDATE Ticket
    SET estado_ticket = 'EN PROCESO', fecha_empieza_proceso = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS CerrarTicket;;
CREATE PROCEDURE CerrarTicket(
    IN _id_ticket INT
)
BEGIN
    UPDATE Ticket
    SET estado_ticket = 'CERRADO', fecha_cerrado = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS RechazarTicket;;
CREATE PROCEDURE RechazarTicket(
    IN _id_ticket INT,
    IN _motivo_ticket VARCHAR(100)
)
BEGIN
    UPDATE Ticket
    SET motivo_ticket = _motivo_ticket, estado_ticket = 'RECHAZADO', fecha_negado = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS AprobarTicket;;
CREATE PROCEDURE AprobarTicket(
    IN _id_ticket INT
)
BEGIN
    UPDATE Ticket
    SET estado_ticket = 'APROBADO', fecha_aceptado = NOW()
    WHERE id_ticket = _id_ticket;
END;;
DELIMITER ;;

-- Eliminar el procedimiento almacenado si ya existe
DROP PROCEDURE IF EXISTS QueryUsuarioGrupo;;
CREATE PROCEDURE QueryUsuarioGrupo(
    IN _Cantidad INT, 
    IN _UsuarioId INT, 
    IN _MateriaId INT, 
    IN _Nombre VARCHAR(128), 
    IN _Dia VARCHAR(128), 
    IN _HoraInicio VARCHAR(32), 
    IN _HoraFin VARCHAR(32), 
    IN _Matricula INT, 
    IN _GrupoId INT, 
    IN _MaestroId INT
)
BEGIN
    SELECT 
        M.Nombre AS Materia, 
        G.Nombre as Nombre, 
        G.Aula as Aula, 
        G.Dia AS Dia, 
        G.HoraInicio AS HoraInicio, 
        G.HoraFin AS HoraFin, 
        G.Id AS Id, 
        CONCAT_WS(' ', U.Nombre, U.ApPaterno, U.ApMaterno) AS Alumno, 
        U.Matricula AS Matricula 
    FROM 
        UsuarioGrupo AS UG
    LEFT JOIN 
        Grupo AS G ON UG.GrupoId = G.Id
    LEFT JOIN 
        Materia AS M ON G.MateriaId = M.Id
    LEFT JOIN 
        Usuario AS U ON UG.UsuarioId = U.Id
    WHERE 
        (UG.UsuarioId = _UsuarioId OR _UsuarioId = 0) AND
        (G.MateriaId = _MateriaId OR _MateriaId IS NULL) AND
        (G.Nombre LIKE CONCAT('%', _Nombre, '%') OR _Nombre = '') AND
        (G.Dia = _Dia OR _Dia = 'TS') AND
        (G.HoraInicio >= _HoraInicio) AND
        (G.HoraFin <= _HoraFin) AND
        (U.Matricula LIKE CONCAT('%', _Matricula, '%') OR _Matricula IS NULL) AND
        (UG.GrupoId = _GrupoId OR _GrupoId = 0) AND
        (G.MaestroId = _MaestroId OR _MaestroId = 0) AND 
        G.Activo = 1
    LIMIT _Cantidad;
END;;
DELIMITER ;;