-- Actualizamos el procedure de QueryGrupo para que busque la columna de activo de grupo y evitar ambiguedades

DROP PROCEDURE IF EXISTS QueryGrupo;
DELIMITER //
CREATE  PROCEDURE `QueryGrupo`(IN `_Cantidad` INT, IN `_MateriaId` INT, IN `_Nombre` VARCHAR(128), IN `_Dia` VARCHAR(32), IN `_HoraInicio` VARCHAR(32), IN `_HoraFin` VARCHAR(32), IN `_MaestroId` INT)
BEGIN
	SELECT Grupo.Id, MateriaId, Materia.Nombre as Materia, Grupo.Nombre as Nombre, Aula, Dia, HoraInicio, HoraFin, Limite, Sesiones, MaestroId,
    CONCAT((SELECT CONVERT(Count(UsuarioId), char) FROM UsuarioGrupo WHERE UsuarioGrupo.GrupoId=Grupo.Id), "/", CONVERT(Limite, char)) AS Inscritos, concat(Maestro.Nombre, ' ', Maestro.ApPaterno, ' ', Maestro.ApMaterno) as Encargado
    FROM Grupo
    LEFT JOIN Materia
    ON Materia.Id = MateriaId
    LEFT JOIN Usuario as Maestro
    ON MaestroId = Maestro.Id
    WHERE 
    (MateriaId=_MateriaId OR _MateriaId is null) AND
    (Grupo.Nombre=_Nombre OR _Nombre="" OR _Nombre is null) AND
    (Dia=_Dia OR _Dia="TS") AND
    (HoraInicio >= _HoraInicio) AND
    (HoraFin <= _HoraFin) AND
    (MaestroId=_MaestroId OR _MaestroId=0) AND
    Grupo.Activo = True
    LIMIT _Cantidad;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS ObtenerAulasActivas;


DELIMITER //

CREATE PROCEDURE ObtenerAulasActivas()
BEGIN
    SELECT * FROM Aula WHERE activo = 1;
END //

DELIMITER ;


DROP PROCEDURE IF EXISTS InsertarAula;

DELIMITER //

CREATE PROCEDURE InsertarAula(IN p_nombre VARCHAR(255))
BEGIN
    INSERT INTO Aula (nombre, activo) VALUES (p_nombre, 1);
END //

DELIMITER ;

-- 21-08-2024 SE EDITO EL SP PARA QUE SEA POR ID NO POR NOMBRE EL UPDATE --LUIS y se cambio el nombre del SP

DROP PROCEDURE IF EXISTS DesactivarAula;

DELIMITER //

CREATE PROCEDURE DesactivarAula(IN p_id INT)
BEGIN
    UPDATE Aula 
    SET activo = 0 
    WHERE id = p_id;
END //

DELIMITER ;

-- editamos el procedure de alta de aula para que valide nombre y activo

DROP PROCEDURE IF EXISTS InsertarAula;

DELIMITER //

CREATE PROCEDURE InsertarAula(IN p_nombre VARCHAR(255))
BEGIN
    DECLARE nombre_mayus VARCHAR(255);
    DECLARE existe INT;

    -- Convertir el nombre a mayúsculas
    SET nombre_mayus = UPPER(p_nombre);

    -- Verificar si ya existe un aula activa con ese nombre
    SELECT COUNT(*) INTO existe
    FROM Aula
    WHERE nombre = nombre_mayus AND activo = 1;

    IF existe > 0 THEN
        -- Si el aula ya existe y está activa, devolver un mensaje de error
        SELECT 'Error: El aula ya existe y está activa.' AS mensaje;
    ELSE
        -- Si el aula no existe o está inactiva, insertar o actualizar el registro
        INSERT INTO Aula (nombre, activo)
        VALUES (nombre_mayus, 1)
        ON DUPLICATE KEY UPDATE activo = 1;

        -- Devolver un mensaje de éxito
        SELECT 'El aula ha sido creada o activada exitosamente.' AS mensaje;
    END IF;
END //

DELIMITER ;

-- editamos el procedure de dar de baja usuarios para que sea por baja logica en vez de fisica

DROP PROCEDURE IF EXISTS DeleteUsuario;

DELIMITER //

CREATE PROCEDURE DeleteUsuario(IN _Id INT)
BEGIN
    UPDATE Usuario
    SET activo = 0
    WHERE Id = _Id;
END //

DELIMITER ;

-- editamos el procedure de dar de baja materias para que sea por baja logica en vez de fisica

DROP PROCEDURE IF EXISTS DeleteMateria;

DELIMITER //

CREATE PROCEDURE DeleteMateria(IN _Id INT)
BEGIN
    UPDATE materia
    SET activo = 0
    WHERE Id = _Id;
END //

DELIMITER ;

-- editamos el procedure de dar de baja usuariogrupo (inscripciones) para que sea por baja logica en vez de fisica

DROP PROCEDURE IF EXISTS DeleteUsuarioGrupo;

DELIMITER //

CREATE PROCEDURE DeleteUsuarioGrupo(IN _UsuarioId INT, IN _GrupoId INT)
BEGIN
    UPDATE UsuarioGrupo
    SET activo = 0
    WHERE UsuarioId = _UsuarioId AND GrupoId = _GrupoId;
END //

DELIMITER ;


-- Se creo un SP para obtener aquellas aulas inactivas

DROP PROCEDURE IF EXISTS ObtenerAulasInactivas;
DELIMITER //

CREATE PROCEDURE ObtenerAulasInactivas()
BEGIN
    SELECT * FROM Aula WHERE activo = 0;
END //

DELIMITER ;


DROP PROCEDURE IF EXISTS GetPerfilId;
DELIMITER //

CREATE PROCEDURE GetPerfilId(
    IN _Id INT
)
BEGIN
    SELECT 
        Id,
        IFNULL(Nombre, '') AS Nombre
    FROM 
        Perfil
    WHERE 
        Id = _Id 
        AND activo = 1;
END//

DELIMITER ;


-- Editamos el procedure de eliminación de perfil para que sea baja lógica en vez de física

DROP PROCEDURE IF EXISTS DeletePerfil;
DELIMITER //

CREATE PROCEDURE DeletePerfil(
    IN _Id INT
)
BEGIN
    UPDATE Perfil 
    SET activo = 0
    WHERE Id = _Id;
END//

DELIMITER ;


-- Se agrego un metodo de reactivacion de Aula -- Luis
DROP PROCEDURE IF EXISTS ReactivarAula;
DELIMITER //

CREATE PROCEDURE ReactivarAula(IN p_id INT)
BEGIN
    UPDATE Aula 
    SET activo = 1 
    WHERE id = p_id;
END //

DELIMITER ;

-- Se editó el stored procedure de busqueda de usuarios para validar el estatus y baneado

DROP PROCEDURE IF EXISTS QueryUsuario;
DELIMITER //

CREATE PROCEDURE QueryUsuario (
    IN _Cantidad INT,
    IN _Matricula INT,
    IN _Nombre VARCHAR(128),
    IN _ApPaterno VARCHAR(128),
    IN _ApMaterno VARCHAR(128),
    IN _PerfilId INT,
    IN _Estatus TINYINT(1),
    IN _Baneado TINYINT(1)
)
BEGIN
    IF _Matricula IS NULL THEN
        SELECT 
            Id,
            Matricula,
            IFNULL(Nombre, "") AS Nombre,
            IFNULL(ApPaterno, "") AS ApPaterno,
            IFNULL(ApMaterno, "") AS ApMaterno,
            Correo,
            PerfilId,
            activo,
            baneado,
            motivoBaneo
        FROM Usuario
        WHERE 
            PerfilId = _PerfilId
            AND Activo = _Estatus
            AND Baneado = _Baneado
            AND Nombre LIKE CONCAT('%', IFNULL(_Nombre, ''), '%')
            AND ApPaterno LIKE CONCAT('%', IFNULL(_ApPaterno, ''), '%')
            AND ApMaterno LIKE CONCAT('%', IFNULL(_ApMaterno, ''), '%')
        LIMIT _Cantidad;
    ELSE
        SELECT 
            Id,
            Matricula,
            IFNULL(Nombre, "") AS Nombre,
            IFNULL(ApPaterno, "") AS ApPaterno,
            IFNULL(ApMaterno, "") AS ApMaterno,
            Correo,
            PerfilId,
            activo,
            baneado,
            motivoBaneo
        FROM Usuario
        WHERE 
            PerfilId = _PerfilId
            AND Matricula = _Matricula
            AND Activo = _Estatus
            AND Baneado = _Baneado
            AND Nombre LIKE CONCAT('%', IFNULL(_Nombre, ''), '%')
            AND ApPaterno LIKE CONCAT('%', IFNULL(_ApPaterno, ''), '%')
            AND ApMaterno LIKE CONCAT('%', IFNULL(_ApMaterno, ''), '%')
        LIMIT _Cantidad;
    END IF;
END//

DELIMITER ;

-- SP PARA OBTENER LAS CARRERAS DEL SISTEMA

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerCarreras//

CREATE PROCEDURE ObtenerCarreras()
BEGIN
    SELECT 
        Id, 
        Nombre
    FROM 
        carrera;
END//

DELIMITER ;


-- SE MODIFICO EL QUERY DE BUSQUEDA DE MATERIAS PARA QUE TENGAS MAS FILTROS

DROP PROCEDURE IF EXISTS QueryMateria;

DELIMITER //

CREATE PROCEDURE QueryMateria(
    IN _Nombre VARCHAR(255),
    IN _CarreraId INT,
    IN _Activo TINYINT
)
BEGIN
    SELECT 
        m.Id,
        IFNULL(m.Nombre, '') AS Nombre,
        c.Nombre AS Carrera,
        m.Activo
    FROM Materia m
    JOIN Carrera c ON m.Carrera = c.Nombre 
    WHERE
        m.Nombre LIKE CONCAT(IFNULL(_Nombre, ''), '%')
        AND (c.Id = _CarreraId OR _CarreraId IS NULL)
        AND m.Activo = _Activo
    LIMIT 100;
END //

DELIMITER ;

-- SE AGREGO OTRO QUERY PARA LA BUSQUEDA DE LAS MATERIAS PARA CB

DROP PROCEDURE IF EXISTS QueryMaterias;

DELIMITER //

CREATE PROCEDURE QueryMaterias()
BEGIN
    SELECT 
        Id,
        IFNULL(Nombre, '') AS Nombre
    FROM Materia
    WHERE Activo = 1;
END //

DELIMITER ;

-- SE AGREGO UN SP PARA REACTIVAR LA MATERIA DADA DE BAJA.



DELIMITER //

DROP PROCEDURE IF EXISTS ReactivarMateria; //

CREATE PROCEDURE ReactivarMateria(IN _Id INT)
BEGIN
    UPDATE materia
    SET activo = 1
    WHERE Id = _Id;
END//

DELIMITER ;


-- SE AGREGO UN SP PARA BANEAR A LOS USUARIOS

DELIMITER //

DROP PROCEDURE IF EXISTS BanUsuario //

CREATE PROCEDURE BanUsuario(
    IN p_idUsuario INT,
    IN p_motivoBaneo VARCHAR(255)
)
BEGIN
    UPDATE usuario
    SET baneado = 1,
        motivoBaneo = p_motivoBaneo
    WHERE Id = p_idUsuario;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario no encontrado o ya está baneado';
    END IF;
END //

DELIMITER ;


DELIMITER //

DROP PROCEDURE IF EXISTS DesbanUsuario //

CREATE PROCEDURE DesbanUsuario(
    IN p_idUsuario INT,
    IN p_idUsuarioDesban INT,
    IN p_motivoDesbaneo VARCHAR(255)
)
BEGIN
    DECLARE v_nombreDesban VARCHAR(128);
    
    SELECT CONCAT_WS(' ', Nombre, ApPaterno, ApMaterno) INTO v_nombreDesban
    FROM usuario
    WHERE Id = p_idUsuarioDesban;
    
    UPDATE usuario
    SET baneado = 0,
        motivoBaneo = CONCAT('Desbaneo por - ', v_nombreDesban, ', Motivo: ', p_motivoDesbaneo)
    WHERE Id = p_idUsuario;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario no encontrado o ya está desbaneado';
    END IF;
END //

DELIMITER ;


-- Editamos el procedure de obtención de perfiles para que valide la columna de activo

DROP PROCEDURE IF EXISTS GetPerfilId;
DELIMITER //

CREATE PROCEDURE GetPerfilId(
    IN _Id INT
)
BEGIN
    SELECT 
        Id,
        IFNULL(Nombre, '') AS Nombre
    FROM 
        Perfil
    WHERE 
        Id = _Id 
        AND activo = 1;
END//

DELIMITER ;


-- Editamos el procedure de eliminación de perfil para que sea baja lógica en vez de física

DROP PROCEDURE IF EXISTS DeletePerfil;
DELIMITER //

CREATE PROCEDURE DeletePerfil(
    IN _Id INT
)
BEGIN
    UPDATE Perfil 
    SET activo = 0
    WHERE Id = _Id;
END//

DELIMITER ;


-- Se agrego un metodo de reactivacion de Aula -- Luis
DROP PROCEDURE IF EXISTS ReactivarAula;
DELIMITER //

CREATE PROCEDURE ReactivarAula(IN p_id INT)
BEGIN
    UPDATE Aula 
    SET activo = 1 
    WHERE id = p_id;
END //

DELIMITER ;

-- Se editó el stored procedure de busqueda de usuarios para validar el estatus y baneado

DROP PROCEDURE IF EXISTS QueryUsuario;
DELIMITER //

CREATE PROCEDURE QueryUsuario (
    IN _Cantidad INT,
    IN _Matricula INT,
    IN _Nombre VARCHAR(128),
    IN _ApPaterno VARCHAR(128),
    IN _ApMaterno VARCHAR(128),
    IN _PerfilId INT,
    IN _Estatus TINYINT(1),
    IN _Baneado TINYINT(1)
)
BEGIN
    IF _Matricula IS NULL THEN
        SELECT 
            Id,
            Matricula,
            IFNULL(Nombre, "") AS Nombre,
            IFNULL(ApPaterno, "") AS ApPaterno,
            IFNULL(ApMaterno, "") AS ApMaterno,
            Correo,
            PerfilId,
            activo,
            baneado,
            motivoBaneo
        FROM Usuario
        WHERE 
            PerfilId = _PerfilId
            AND Activo = _Estatus
            AND Baneado = _Baneado
            AND Nombre LIKE CONCAT('%', IFNULL(_Nombre, ''), '%')
            AND ApPaterno LIKE CONCAT('%', IFNULL(_ApPaterno, ''), '%')
            AND ApMaterno LIKE CONCAT('%', IFNULL(_ApMaterno, ''), '%')
        LIMIT _Cantidad;
    ELSE
        SELECT 
            Id,
            Matricula,
            IFNULL(Nombre, "") AS Nombre,
            IFNULL(ApPaterno, "") AS ApPaterno,
            IFNULL(ApMaterno, "") AS ApMaterno,
            Correo,
            PerfilId,
            activo,
            baneado,
            motivoBaneo
        FROM Usuario
        WHERE 
            PerfilId = _PerfilId
            AND Matricula = _Matricula
            AND Activo = _Estatus
            AND Baneado = _Baneado
            AND Nombre LIKE CONCAT('%', IFNULL(_Nombre, ''), '%')
            AND ApPaterno LIKE CONCAT('%', IFNULL(_ApPaterno, ''), '%')
            AND ApMaterno LIKE CONCAT('%', IFNULL(_ApMaterno, ''), '%')
        LIMIT _Cantidad;
    END IF;
END//

DELIMITER ;

-- SP PARA OBTENER LAS CARRERAS DEL SISTEMA

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerCarreras//

CREATE PROCEDURE ObtenerCarreras()
BEGIN
    SELECT 
        Id, 
        Nombre
    FROM 
        carrera;
END//

DELIMITER ;


-- SE MODIFICO EL QUERY DE BUSQUEDA DE MATERIAS PARA QUE TENGAS MAS FILTROS

DROP PROCEDURE IF EXISTS QueryMateria;

DELIMITER //

CREATE PROCEDURE QueryMateria(
    IN _Nombre VARCHAR(255),
    IN _CarreraId INT,
    IN _Activo TINYINT
)
BEGIN
    SELECT 
        m.Id,
        IFNULL(m.Nombre, '') AS Nombre,
        c.Nombre AS Carrera,
        m.Activo
    FROM Materia m
    JOIN Carrera c ON m.Carrera = c.Nombre 
    WHERE
        m.Nombre LIKE CONCAT(IFNULL(_Nombre, ''), '%')
        AND (c.Id = _CarreraId OR _CarreraId IS NULL)
        AND m.Activo = _Activo
    LIMIT 100;
END //

DELIMITER ;

-- SE AGREGO OTRO QUERY PARA LA BUSQUEDA DE LAS MATERIAS PARA CB

DROP PROCEDURE IF EXISTS QueryMaterias;

DELIMITER //

CREATE PROCEDURE QueryMaterias()
BEGIN
    SELECT 
        Id,
        IFNULL(Nombre, '') AS Nombre
    FROM Materia
    WHERE Activo = 1;
END //

DELIMITER ;

-- SE AGREGO UN SP PARA REACTIVAR LA MATERIA DADA DE BAJA.



DELIMITER //

DROP PROCEDURE IF EXISTS ReactivarMateria; //

CREATE PROCEDURE ReactivarMateria(IN _Id INT)
BEGIN
    UPDATE materia
    SET activo = 1
    WHERE Id = _Id;
END//

DELIMITER ;


-- SE AGREGO UN SP PARA BANEAR A LOS USUARIOS

DELIMITER //

DROP PROCEDURE IF EXISTS BanUsuario //

CREATE PROCEDURE BanUsuario(
    IN p_idUsuario INT,
    IN p_motivoBaneo VARCHAR(255)
)
BEGIN
    UPDATE usuario
    SET baneado = 1,
        motivoBaneo = p_motivoBaneo
    WHERE Id = p_idUsuario;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario no encontrado o ya está baneado';
    END IF;
END //

DELIMITER ;


DELIMITER //

DROP PROCEDURE IF EXISTS DesbanUsuario //

CREATE PROCEDURE DesbanUsuario(
    IN p_idUsuario INT,
    IN p_idUsuarioDesban INT,
    IN p_motivoDesbaneo VARCHAR(255)
)
BEGIN
    DECLARE v_nombreDesban VARCHAR(128);
    
    SELECT CONCAT_WS(' ', Nombre, ApPaterno, ApMaterno) INTO v_nombreDesban
    FROM usuario
    WHERE Id = p_idUsuarioDesban;
    
    UPDATE usuario
    SET baneado = 0,
        motivoBaneo = CONCAT('Desbaneo por - ', v_nombreDesban, ', Motivo: ', p_motivoDesbaneo)
    WHERE Id = p_idUsuario;
    
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario no encontrado o ya está desbaneado';
    END IF;
END //

DELIMITER ;

-- SE MODIFICO EL SP DE CERRAR TICKET PARA QUE ACEPTE EL MOTIVO Y EL ID DEL ADMIN. 
DELIMITER //

DROP PROCEDURE IF EXISTS CerrarTicket //

CREATE PROCEDURE CerrarTicket(
    IN _id_ticket INT,
    IN _motivo VARCHAR(255),
    IN _id_admin INT 
)
BEGIN
    UPDATE Ticket
    SET 
        estado_ticket = 'CERRADO', 
        fecha_cerrado = NOW(),
        motivo_administrador = _motivo, 
        id_admin = _id_admin 
    WHERE 
        id_ticket = _id_ticket;
END //

DELIMITER ;

-- SEE MODIFICO EL QUERY DE TICKET PARA TRAER AHORA LA FECHA DE CIERRE, EL ADMIN QUE CERRO EL TICKET Y EL MOTIVO DEL CIERRE

DELIMITER //

DROP PROCEDURE IF EXISTS `QueryTicket`//

CREATE PROCEDURE `QueryTicket`()
BEGIN
    SET lc_time_names = 'es_ES';
    
    SELECT 
        t.id_ticket AS Id,
        t.aula_ticket AS Aula,
        t.equipo_ticket AS Equipo,
        t.descripcion_requerimiento_ticket AS Descripcion,
        t.estado_ticket AS Estado,
        t.motivo_ticket AS Motivo,
        t.soporte AS Soporte,
        t.motivo_administrador AS Motivo_Admin,
        CONCAT(
            DATE_FORMAT(t.fecha_cerrado, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_cerrado, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_cerrado, '%b'), 2))),
            DATE_FORMAT(t.fecha_cerrado, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_cerrado, '%p'))
        ) AS FechaCierre,
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS Creador,
        CONCAT(
            DATE_FORMAT(t.fecha_alta_ticket, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 2))),
            DATE_FORMAT(t.fecha_alta_ticket, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_alta_ticket, '%p'))
        ) AS FechaCreacion,
        IFNULL(CONCAT(admin.Nombre, ' ', admin.ApPaterno, ' ', admin.ApMaterno), 'No disponible') AS Administrador
    FROM 
        Ticket t
    JOIN
        Usuario u ON t.creador_ticket = u.Id
    LEFT JOIN
        Usuario admin ON t.id_admin = admin.Id
    WHERE 
        t.activo_ticket = 1
    ORDER BY 
        t.fecha_alta_ticket DESC;  -- Ordenar por Id de manera descendente

END//

DELIMITER ;


-- SE MODIFICO EL SP DE CREACION DE AULA PARA QUE AHORA TOME CAPACIDAD. 


DELIMITER //
DROP PROCEDURE IF EXISTS InsertarAula//
CREATE PROCEDURE InsertarAula(
    IN p_nombre VARCHAR(255),
    IN p_capacidad INT
)
BEGIN
    DECLARE nombre_mayus VARCHAR(255);
    DECLARE existe INT;

    -- Convertir el nombre a mayúsculas
    SET nombre_mayus = UPPER(p_nombre);

    -- Verificar si ya existe un aula activa con ese nombre
    SELECT COUNT(*) INTO existe
    FROM Aula
    WHERE nombre = nombre_mayus AND activo = 1;

    IF existe > 0 THEN
        -- Si el aula ya existe y está activa, devolver un mensaje de error
        SELECT 'Error: El aula ya existe y está activa.' AS mensaje;
    ELSE
        -- Si el aula no existe o está inactiva, insertar o actualizar el registro
        INSERT INTO Aula (nombre, capacidad, activo)
        VALUES (nombre_mayus, p_capacidad, 1)
        ON DUPLICATE KEY UPDATE activo = 1, capacidad = p_capacidad;

        -- Devolver un mensaje de éxito
        SELECT 'El aula ha sido creada o activada exitosamente.' AS mensaje;
    END IF;
END//

DELIMITER ;


-- SE MODIFICO EL SP DE OBTENER AULAS ACTIVAS PARA QUE NOS DE LA CAPACIDAD

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerAulasActivas //

CREATE PROCEDURE ObtenerAulasActivas()
BEGIN
    SELECT 
        id,
        nombre,
        capacidad,
        activo,
        prestable
    FROM 
        Aula 
    WHERE 
        activo = 1;
END //

DELIMITER ;


-- SE MODIFICO EL SP DE OBTENER AULAS INACTIVAS PARA QUE NOS DE LA CAPACIDAD
DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerAulasInactivas //

CREATE PROCEDURE ObtenerAulasInactivas()
BEGIN
    SELECT 
        id,
        nombre,
        capacidad,
        activo,
        prestable
    FROM 
        Aula 
    WHERE 
        activo = 0;
END //

DELIMITER ;



-- SP DE INSERTAR HORARIO *AUN FALTAN CONSIDERACIONES*

DROP PROCEDURE IF EXISTS InsertarHorario;
DELIMITER //

CREATE PROCEDURE InsertarHorario(
    IN p_id_aula INT,
    IN p_dia_semana ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'),
    IN p_hora_inicio TIME,
    IN p_hora_fin TIME
)
BEGIN
    DECLARE empalme INT;

    -- Verificar si ya existe un horario que se empalme en el mismo día
    SELECT COUNT(*) INTO empalme
    FROM HorariosAulas
    WHERE id_aula = p_id_aula
      AND dia_semana = p_dia_semana
      AND (
        (p_hora_inicio >= hora_inicio AND p_hora_inicio < hora_fin)  -- Inicio del nuevo horario está dentro de uno existente
        OR 
        (p_hora_fin > hora_inicio AND p_hora_fin <= hora_fin)        -- Fin del nuevo horario está dentro de uno existente
        OR
        (p_hora_inicio <= hora_inicio AND p_hora_fin >= hora_fin)    -- El nuevo horario abarca completamente a uno existente
      );

    IF empalme > 0 THEN
        SELECT 'Error: El horario se empalma con otro ya existente.' AS mensaje;
    ELSE
        INSERT INTO HorariosAulas (id_aula, dia_semana, hora_inicio, hora_fin)
        VALUES (p_id_aula, p_dia_semana, p_hora_inicio, p_hora_fin);

        SELECT 'Horario agregado exitosamente.' AS mensaje;
    END IF;
END//

DELIMITER ;


-- SP OBTENER HORARIOS DE LAS AULAS.

DROP PROCEDURE IF EXISTS ObtenerHorariosAula;
DELIMITER //

CREATE PROCEDURE ObtenerHorariosAula(
    IN _id_aula INT
)
BEGIN
    SELECT 
        id AS IdHorario,
        dia_semana AS Dia,
        hora_inicio AS HoraInicio,
        hora_fin AS HoraFin
    FROM HorariosAulas
    WHERE id_aula = _id_aula
    ORDER BY
        FIELD(dia_semana, 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'), hora_inicio;
END//

DELIMITER ;


-- SP DE ELIMINACION DE HORARIO 

DROP PROCEDURE IF EXISTS EliminarHorario;
DELIMITER //

CREATE PROCEDURE EliminarHorario(
    IN _id_horario INT
)
BEGIN
    DELETE FROM HorariosAulas
    WHERE id = _id_horario;
END//

DELIMITER ;


-- EDITAR EL AULA

DROP PROCEDURE IF EXISTS EditarAula;
DELIMITER //

CREATE PROCEDURE EditarAula(
    IN _id_aula INT,
    IN _nombre_aula VARCHAR(255),
    IN _capacidad INT
)
BEGIN
    DECLARE aula_existe INT;

    SELECT COUNT(*) INTO aula_existe
    FROM Aula
    WHERE nombre = _nombre_aula AND id != _id_aula;

    IF aula_existe > 0 THEN
        SELECT 'Error: Ya existe un aula con ese nombre.' AS mensaje;
    ELSE
        -- Si no existe, realizar la actualización
        UPDATE Aula
        SET nombre = _nombre_aula,
            capacidad = _capacidad
        WHERE id = _id_aula;

        -- Devolver mensaje de éxito
        SELECT 'El aula ha sido actualizada correctamente.' AS mensaje;
    END IF;

END//

DELIMITER ;


-- SP PARA ACTIVAR LA PRESTACION DE LAS AULAS.

DELIMITER //

DROP PROCEDURE IF EXISTS PrestamoAulaBool //

CREATE PROCEDURE PrestamoAulaBool(
    IN p_id_aula INT,         
    IN p_prestable TINYINT    
)
BEGIN
    UPDATE Aula
    SET prestable = p_prestable
    WHERE id = p_id_aula;

    SELECT 'Estado de prestable actualizado correctamente.' AS mensaje;
END //

DELIMITER ;


DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerAulasPrestablesActivas //

CREATE PROCEDURE ObtenerAulasPrestablesActivas()
BEGIN
    -- Selecciona las aulas que son prestables y están activas
    SELECT 
        id AS IdAula,
        nombre AS NombreAula,
        capacidad AS Capacidad,
        prestable,
        activo
    FROM Aula
    WHERE prestable = 1 AND activo = 1;
END //

DELIMITER ;

-- SP PARA PRESTAMO DE AULA

DELIMITER //

DROP PROCEDURE IF EXISTS AddSolicitud //

CREATE PROCEDURE AddSolicitud(
    IN p_id_aula INT,
    IN p_id_usuario_pide INT,
    IN p_fecha_alta DATETIME,
    IN p_fecha_hora_inicio DATETIME,
    IN p_fecha_hora_fin DATETIME
)
BEGIN
    INSERT INTO prestamoaula (
        ID_Aula, 
        ID_Usuario_Pide, 
        Fecha_Alta, 
        Fecha_Hora_Inicio, 
        Fecha_Hora_Fin
    ) 
    VALUES (
        p_id_aula,                      
        p_id_usuario_pide,                
        NOW(),                     
        p_fecha_hora_inicio,              
        p_fecha_hora_fin                 
    );

END //

DELIMITER ;


-- HORARIOS EN CALENDARIO


DROP PROCEDURE IF EXISTS ObtenerHorarios; 

DELIMITER //


CREATE PROCEDURE ObtenerHorarios()
BEGIN
    SELECT 
        h.id AS IdHorario,
        h.dia_semana AS Dia,
        h.hora_inicio AS HoraInicio,
        h.hora_fin AS HoraFin,
        a.id AS IdAula
    FROM horariosaulas h
    JOIN aula a ON h.id_aula = a.id
    WHERE a.activo = 1 
      AND a.prestable = 1
    ORDER BY 
        FIELD(h.dia_semana, 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'), 
        h.hora_inicio;
END //

DELIMITER ;


DROP PROCEDURE IF EXISTS ObtenerDetallesPrestamosAulas;

DELIMITER //

CREATE PROCEDURE ObtenerDetallesPrestamosAulas()
BEGIN
    SELECT 
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', COALESCE(u.ApMaterno, '')) AS Creador, 
        p.Nombre AS Perfil, 
        pa.ID_Prestamo,
        a.Nombre AS Aula, 
        pa.Fecha_Alta, 
        DATE(pa.Fecha_Hora_Inicio) AS FechaPrestamo, 
        TIME(pa.Fecha_Hora_Inicio) AS HoraInicio, 
        TIME(pa.Fecha_Hora_Fin) AS HoraFin, 
        pa.Fecha_Hora_Cerrado AS FechaCerrado,
        pa.Fecha_Hora_Confirmación AS FechaConfirmacion,
        pa.Estatus, 
        CONCAT(adminAprob.Nombre, ' ', adminAprob.ApPaterno, ' ', COALESCE(adminAprob.ApMaterno, '')) AS AdminAprobado,
        CONCAT(adminConf.Nombre, ' ', adminConf.ApPaterno, ' ', COALESCE(adminConf.ApMaterno, '')) AS AdminConfirma, 
        pa.Observaciones 
    FROM prestamoaula pa
    JOIN usuario u ON pa.ID_Usuario_Pide = u.Id 
    JOIN perfil p ON u.PerfilId = p.Id 
    LEFT JOIN usuario adminAprob ON pa.ID_Admin_Aprueba = adminAprob.Id 
    LEFT JOIN usuario adminConf ON pa.ID_Admin_Confirma = adminConf.Id 
    LEFT JOIN aula a ON pa.ID_Aula = a.id 
    WHERE pa.activo = 1
    ORDER BY 
        DATE(pa.Fecha_Alta) DESC,         
        CASE 
            WHEN u.PerfilId = 2 THEN 0     
            ELSE 1                         
        END,
        pa.Fecha_Alta DESC;              
END //

DELIMITER ;


-- SE MODIFICO EL SP DE APROBACION DE PRESTAMO DE AULA 

DELIMITER //

DROP PROCEDURE IF EXISTS AprobarAulaSolicitud//

CREATE PROCEDURE AprobarAulaSolicitud(
    IN p_id_solicitud INT, 
    IN p_id_admin INT      
)
BEGIN
    UPDATE PrestamoAula
    SET 
        Estatus = 'APROBADA',    
        ID_Admin_Aprueba = p_id_admin   
    WHERE 
        ID_Prestamo = p_id_solicitud;     
END//

DELIMITER ;


-- SP DE CONFIRMACION DE AULA 


DELIMITER //

DROP PROCEDURE IF EXISTS ConfirmarAulaSolicitud//

CREATE PROCEDURE ConfirmarAulaSolicitud(
    IN p_id_solicitud INT, 
    IN p_id_admin INT      
)
BEGIN
  
    UPDATE prestamoaula
    SET 
        Estatus = 'CONFIRMADO',        
        Confirmado = 1,                 
        ID_Admin_Confirma = p_id_admin,
        Fecha_Hora_Confirmación = NOW()
    WHERE 
        ID_Prestamo = p_id_solicitud;     
END//

DELIMITER ;


-- SP CERRADO DE PRESTAMO DE AULA

DROP PROCEDURE IF EXISTS CerradoAulaSolicitud; 
DELIMITER //

CREATE PROCEDURE CerradoAulaSolicitud(
    IN p_id_prestamo INT,
    IN p_observaciones VARCHAR(250),
    IN p_anomalia TINYINT(1)
)
BEGIN
    UPDATE PrestamoAula
    SET 
        Estatus = 'CERRADO',
        Fecha_Hora_Cerrado = NOW(),
        Liberada = 1,
        Anomalia = p_anomalia,
        Observaciones = p_observaciones
    WHERE ID_Prestamo = p_id_prestamo;
END //

DELIMITER ;


-- COUNT DE LOS PRESTAMOS DE AULAS

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerCountSolicitudes//

CREATE PROCEDURE ObtenerCountSolicitudes(
    IN p_id_aula INT,                   
    IN p_fecha DATE,                     
    IN p_hora_inicio DATETIME,          
    IN p_hora_fin DATETIME           
)
BEGIN
    SELECT 
        COUNT(*) AS TotalSolicitudes      
    FROM prestamoaula pa
    JOIN aula a ON pa.ID_Aula = a.id    
    WHERE 
        pa.ID_Aula = p_id_aula AND       
        pa.Estatus IN ('APROBADO', 'CONFIRMADO') AND 
        DATE(pa.Fecha_Hora_Inicio) = p_fecha AND  
        pa.Fecha_Hora_Inicio < p_hora_fin AND     
        pa.Fecha_Hora_Fin > p_hora_inicio;     
END//

DELIMITER ;


-- modificacion de alta de SP 

DELIMITER //

DROP PROCEDURE IF EXISTS AddSolicitud//

CREATE DEFINER=`root`@`localhost` PROCEDURE AddSolicitud(
    IN p_id_aula INT,
    IN p_id_usuario_pide INT,
    IN p_fecha_alta DATETIME,
    IN p_fecha_hora_inicio DATETIME,
    IN p_fecha_hora_fin DATETIME
)
BEGIN
    DECLARE p_id_solicitud INT; 

    SELECT pa.ID_Prestamo INTO p_id_solicitud
    FROM PrestamoAula pa
    JOIN Usuario u ON pa.ID_Usuario_Pide = u.Id
    WHERE 
        u.PerfilId = 2 AND 
        pa.Estatus IN ('APROBADA', 'CONFIRMADA') AND
        (
            (pa.Fecha_Hora_Inicio < p_fecha_hora_fin AND pa.Fecha_Hora_Fin > p_fecha_hora_inicio) 
            OR 
            (DATE(pa.Fecha_Hora_Inicio) = DATE(p_fecha_hora_inicio)) AND 
            (pa.Fecha_Hora_Inicio <= p_fecha_hora_inicio AND pa.Fecha_Hora_Fin >= p_fecha_hora_fin)
        );

    IF p_id_solicitud IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Ya existe una solicitud de un maestro aprobada o confirmada en este horario.';
    END IF;

    -- Si no hay conflictos, insertar la nueva solicitud
    INSERT INTO prestamoaula (
        ID_Aula, 
        ID_Usuario_Pide, 
        Fecha_Alta, 
        Fecha_Hora_Inicio, 
        Fecha_Hora_Fin
    ) 
    VALUES (
        p_id_aula,                      
        p_id_usuario_pide,                
        NOW(),                     
        p_fecha_hora_inicio,              
        p_fecha_hora_fin                 
    );

END//

DELIMITER ;


-- MODIFICACION HISTORIAL DE PRESTAMOS SP

DELIMITER //

DROP PROCEDURE IF EXISTS GetSolicitudes//

CREATE PROCEDURE GetSolicitudes(IN p_usuario_actual INT)
BEGIN
    SELECT 
        pa.ID_Prestamo AS id_solicitud,
        a.nombre AS nombre_aula, 
        DATE(pa.Fecha_Alta) AS fecha_alta_solicitud,
        DATE(pa.Fecha_Hora_Inicio) AS fecha_solicitud,
        pa.Estatus AS estado_solicitud
    FROM PrestamoAula pa
    JOIN Aula a ON pa.ID_Aula = a.id 
    WHERE pa.ID_Usuario_Pide = p_usuario_actual AND pa.activo = 1
    ORDER BY pa.ID_Prestamo DESC;
END//

DELIMITER ;


-- TOGGLE DE SOPORTE


DELIMITER //

DROP PROCEDURE IF EXISTS ToggleSoporte//

CREATE PROCEDURE ToggleSoporte(
    IN p_id_ticket INT,
    IN p_soporte TINYINT
)
BEGIN
    UPDATE ticket
    SET soporte = p_soporte
    WHERE id_ticket = p_id_ticket;
END//

DELIMITER ;


DELIMITER //


--  MODIFICACION DEL QUERY TICKET PARA QUE TRAIGA EL SOPORTE


DROP PROCEDURE IF EXISTS `QueryTicket`//

CREATE PROCEDURE `QueryTicket`()
BEGIN
    SET lc_time_names = 'es_ES';
    
    SELECT 
        t.id_ticket AS Id,
        t.aula_ticket AS Aula,
        t.equipo_ticket AS Equipo,
        t.descripcion_requerimiento_ticket AS Descripcion,
        t.estado_ticket AS Estado,
        t.motivo_ticket AS Motivo,
        t.soporte AS Soporte,
        t.motivo_administrador AS Motivo_Admin,
        CONCAT(
            DATE_FORMAT(t.fecha_cerrado, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_cerrado, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_cerrado, '%b'), 2))),
            DATE_FORMAT(t.fecha_cerrado, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_cerrado, '%p'))
        ) AS FechaCierre,
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS Creador,
        CONCAT(
            DATE_FORMAT(t.fecha_alta_ticket, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 2))),
            DATE_FORMAT(t.fecha_alta_ticket, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_alta_ticket, '%p'))
        ) AS FechaCreacion,
        IFNULL(CONCAT(admin.Nombre, ' ', admin.ApPaterno, ' ', admin.ApMaterno), 'No disponible') AS Administrador
    FROM 
        Ticket t
    JOIN
        Usuario u ON t.creador_ticket = u.Id
    LEFT JOIN
        Usuario admin ON t.id_admin = admin.Id
    WHERE 
        t.activo_ticket = 1
    ORDER BY 
        t.fecha_alta_ticket DESC;  -- Ordenar por Id de manera descendente

END//

DELIMITER ;


DELIMITER //


-- MODIFICACION DE SP DE QUERY TICKET PARA TOMAR LA CUENTA LA FECHA EN EL FILTRO
DELIMITER //

DROP PROCEDURE IF EXISTS `QueryTicket`//


CREATE DEFINER=`root`@`localhost` PROCEDURE `QueryTicket`()
BEGIN
    SET lc_time_names = 'es_ES';
    
    SELECT 
        t.id_ticket AS Id,
        t.aula_ticket AS Aula,
        t.equipo_ticket AS Equipo,
        t.descripcion_requerimiento_ticket AS Descripcion,
         DATE(t.fecha_alta_ticket) AS FechaCreacionJS,
        t.estado_ticket AS Estado,
        t.motivo_ticket AS Motivo,
        t.soporte AS Soporte,
        t.motivo_administrador AS Motivo_Admin,
        CONCAT(
            DATE_FORMAT(t.fecha_cerrado, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_cerrado, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_cerrado, '%b'), 2))),
            DATE_FORMAT(t.fecha_cerrado, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_cerrado, '%p'))
        ) AS FechaCierre,
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS Creador,
        CONCAT(
            DATE_FORMAT(t.fecha_alta_ticket, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 2))),
            DATE_FORMAT(t.fecha_alta_ticket, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_alta_ticket, '%p'))
        ) AS FechaCreacion,
        IFNULL(CONCAT(admin.Nombre, ' ', admin.ApPaterno, ' ', admin.ApMaterno), 'No disponible') AS Administrador
    FROM 
        Ticket t
    JOIN
        Usuario u ON t.creador_ticket = u.Id
    LEFT JOIN
        Usuario admin ON t.id_admin = admin.Id
    WHERE 
        t.activo_ticket = 1
    ORDER BY 
        t.fecha_alta_ticket DESC;  -- Ordenar por Id de manera descendente

END//
DELIMITER ;


-- QUERY TICKET PARA QUE TRAIGA SOLAMENTE LOS TICKETS QUE SEAN DE SOPORTE
DELIMITER //

DROP PROCEDURE IF EXISTS `QueryTicketSoporte`//

CREATE PROCEDURE `QueryTicketSoporte`()
BEGIN
    SET lc_time_names = 'es_ES';
    
    SELECT 
        t.id_ticket AS Id,
        t.aula_ticket AS Aula,
        t.equipo_ticket AS Equipo,
        t.descripcion_requerimiento_ticket AS Descripcion,
        t.estado_ticket AS Estado,
        t.motivo_ticket AS Motivo,
        t.soporte AS Soporte,
        t.motivo_administrador AS Motivo_Admin,
        CONCAT(
            DATE_FORMAT(t.fecha_cerrado, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_cerrado, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_cerrado, '%b'), 2))),
            DATE_FORMAT(t.fecha_cerrado, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_cerrado, '%p'))
        ) AS FechaCierre,
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS Creador,
        CONCAT(
            DATE_FORMAT(t.fecha_alta_ticket, '%e de '), 
            CONCAT(UPPER(LEFT(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 1)), LOWER(SUBSTRING(DATE_FORMAT(t.fecha_alta_ticket, '%b'), 2))),
            DATE_FORMAT(t.fecha_alta_ticket, ', %Y a las %h:%i '), 
            LOWER(DATE_FORMAT(t.fecha_alta_ticket, '%p'))
        ) AS FechaCreacion,
        IFNULL(CONCAT(admin.Nombre, ' ', admin.ApPaterno, ' ', admin.ApMaterno), 'No disponible') AS Administrador
    FROM 
        Ticket t
    JOIN
        Usuario u ON t.creador_ticket = u.Id
    LEFT JOIN
        Usuario admin ON t.id_admin = admin.Id
    WHERE 
        t.activo_ticket = 1
        AND t.soporte = 1
    ORDER BY 
        t.fecha_alta_ticket DESC;  -- Ordenar por Id de manera descendente

END//

DELIMITER ;


-- SP OBTENER EQUIPOS ACTIVOS



DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerEquiposActivos//

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerEquiposActivos`()
BEGIN
    SELECT 
        id,
        nombre
    FROM 
        equipo 
    WHERE 
        activo = 1;
END//
DELIMITER ;



-- SP OBTENER EQUIPOS Inactivos

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerEquiposInactivos//


CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerEquiposInactivos`()
BEGIN
    SELECT 
        id,
        nombre
    FROM 
        equipo 
    WHERE 
        activo = 0;
END//
DELIMITER ;



-- SP DESACTIVAR EQUIPO 

DELIMITER //

DROP PROCEDURE IF EXISTS DesactivarEquipo//

CREATE DEFINER=`root`@`localhost` PROCEDURE `DesactivarEquipo`(IN p_id INT)
BEGIN
    UPDATE equipo 
    SET activo = 0 
    WHERE id = p_id;
END//
DELIMITER ;

-- SP REACTIVAR EQUIPO


DELIMITER //


DROP PROCEDURE IF EXISTS ReactivarEquipo//


CREATE DEFINER=`root`@`localhost` PROCEDURE `ReactivarEquipo`(IN p_id INT)
BEGIN
    UPDATE equipo 
    SET activo = 1 
    WHERE id = p_id;
END//
DELIMITER ;


-- SP EDITAR EQUIPO

DELIMITER //

DROP PROCEDURE IF EXISTS EditarEquipo//

CREATE PROCEDURE `EditarEquipo`(
    IN _id_equipo INT,
    IN _nombre_equipo VARCHAR(255)
)
BEGIN
    DECLARE equipo_existe INT;

    -- Verificar si ya existe un equipo con el mismo nombre y diferente ID
    SELECT COUNT(*) INTO equipo_existe
    FROM equipo
    WHERE nombre = _nombre_equipo AND id != _id_equipo;

    IF equipo_existe > 0 THEN
        SELECT 'Error: Ya existe un equipo con ese nombre.' AS mensaje;
    ELSE
        -- Si no existe, realizar la actualización
        UPDATE equipo
        SET nombre = _nombre_equipo
        WHERE id = _id_equipo;

        -- Devolver mensaje de éxito
        SELECT 'El equipo ha sido actualizado correctamente.' AS mensaje;
    END IF;

END//

DELIMITER ;


-- SP OBTENER PEDIMENTOS DE EQUIPOS DE UN USUARIO


DELIMITER //

DROP PROCEDURE IF EXISTS GetSolicitudesEquiposUsuario //


CREATE PROCEDURE GetSolicitudesEquiposUsuario (
    IN p_id_usuario INT
)
BEGIN
    SELECT 
        pe.ID_PrestamoEquipo AS numero_pedido,
        e.nombre AS nombreEquipo,
        pe.Fecha_Hora_Inicio AS fecha_inicio,
        pe.Fecha_Hora_Fin AS fecha_fin,
        pe.Fecha_Alta AS fecha_alta,
        pe.Estatus AS estatus
    FROM 
        prestamoequipo pe
    JOIN 
        equipo e ON pe.ID_Equipo = e.id
    WHERE 
        pe.ID_Usuario_Pide = p_id_usuario AND pe.activo = 1;
END //

DELIMITER ;


-- SP PARA HACER INSERCION DE NUEVOS PRESTAMOS DE EQUIPOS


DELIMITER //

DROP PROCEDURE IF EXISTS AltaPrestamoEquipo//

CREATE DEFINER=`root`@`localhost` PROCEDURE `AltaPrestamoEquipo` (
    IN p_ID_Equipo INT,
    IN p_ID_Usuario_Pide INT,
    IN p_Fecha_Hora_Inicio DATETIME,
    IN p_Fecha_Hora_Fin DATETIME
)
BEGIN
    DECLARE v_CountPendiente INT DEFAULT 0;
    DECLARE v_CountEquipoOcupado INT DEFAULT 0;
    DECLARE v_RolId INT;

    -- Obtener el rol del usuario solicitante
    SELECT PerfilId INTO v_RolId
    FROM usuario
    WHERE Id = p_ID_Usuario_Pide;

    -- Verificación de solicitudes pendientes para usuarios con rol específico
    IF v_RolId = 4 THEN
        SELECT COUNT(*) INTO v_CountPendiente
        FROM prestamoequipo
        WHERE ID_Usuario_Pide = p_ID_Usuario_Pide
        AND DATE(Fecha_Hora_Inicio) = DATE(p_Fecha_Hora_Inicio)
        AND Estatus = 'PENDIENTE';

        IF v_CountPendiente > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Ya tienes una solicitud pendiente para este día, debes esperar a que sea contestada.';
        END IF; 
    END IF; 

    -- Verificación de ocupación del equipo en el horario solicitado
    SELECT COUNT(*) INTO v_CountEquipoOcupado
    FROM prestamoequipo
    WHERE ID_Equipo = p_ID_Equipo
    AND DATE(Fecha_Hora_Inicio) = DATE(p_Fecha_Hora_Inicio)
    AND ( (p_Fecha_Hora_Inicio < Fecha_Hora_Fin AND p_Fecha_Hora_Fin > Fecha_Hora_Inicio) )
    AND Estatus IN ('APROBADA', 'CONFIRMADO');

    IF v_CountEquipoOcupado > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El equipo ya está ocupado en la fecha y hora solicitadas.';
    END IF; 

    -- Inserción de la solicitud
    INSERT INTO prestamoequipo (
        ID_Equipo,
        ID_Usuario_Pide,
        Estatus,
        Fecha_Alta,
        Fecha_Hora_Inicio,
        Fecha_Hora_Fin
    ) VALUES (
        p_ID_Equipo,
        p_ID_Usuario_Pide,
        'PENDIENTE',
        NOW(), 
        p_Fecha_Hora_Inicio,
        p_Fecha_Hora_Fin
    );

    -- Confirmación de éxito después del INSERT
    SELECT 'Solicitud de préstamo de equipo enviada exitosamente.' AS mensaje;

END//

DELIMITER ;

-- OBTENER DETALLES DE PRESTAMOS DE EQUIPOS


DROP PROCEDURE IF EXISTS ObtenerDetallesPrestamosEquipos;

DELIMITER //

CREATE PROCEDURE ObtenerDetallesPrestamosEquipos()
BEGIN
    SELECT 
        CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', COALESCE(u.ApMaterno, '')) AS Creador, 
        p.Nombre AS Perfil, 
        pe.ID_PrestamoEquipo,
        e.Nombre AS Equipo, 
        pe.Fecha_Alta, 
        DATE(pe.Fecha_Hora_Inicio) AS FechaPrestamo, 
        TIME(pe.Fecha_Hora_Inicio) AS HoraInicio, 
        TIME(pe.Fecha_Hora_Fin) AS HoraFin, 
        pe.Fecha_Hora_Cerrado AS FechaCerrado,
        pe.Fecha_Hora_Confirmado AS FechaConfirmacion,
        pe.Estatus, 
        CONCAT(adminAprob.Nombre, ' ', adminAprob.ApPaterno, ' ', COALESCE(adminAprob.ApMaterno, '')) AS AdminAprobado,
        CONCAT(adminConf.Nombre, ' ', adminConf.ApPaterno, ' ', COALESCE(adminConf.ApMaterno, '')) AS AdminConfirma, 
        pe.Observaciones 
    FROM prestamoequipo pe
    JOIN usuario u ON pe.ID_Usuario_Pide = u.Id 
    JOIN perfil p ON u.PerfilId = p.Id 
    LEFT JOIN usuario adminAprob ON pe.ID_Admin_Aprueba = adminAprob.Id 
    LEFT JOIN usuario adminConf ON pe.ID_Admin_Confirma = adminConf.Id 
    LEFT JOIN equipo e ON pe.ID_Equipo = e.Id 
    WHERE pe.activo = 1
    ORDER BY 
        DATE(pe.Fecha_Alta) DESC,         
        CASE 
            WHEN u.PerfilId = 2 THEN 0     
            ELSE 1                         
        END,
        pe.Fecha_Alta DESC;   
END //

DELIMITER ;

-- ACTUALIZACION DE SP RECHAZADO SOLICITUD DE AULA

DELIMITER //

DROP PROCEDURE IF EXISTS RechazarSolicitud//

CREATE DEFINER=`root`@`localhost` PROCEDURE `RechazarSolicitud`(IN p_id_solicitud INT)
BEGIN
UPDATE prestamoaula
SET Estatus = 'RECHAZADA'
WHERE ID_Prestamo = p_id_solicitud;
END//
DELIMITER ;

-- SP RECHAZO DE SOLICITUD DE EQUIPO

DELIMITER //

DROP PROCEDURE IF EXISTS RechazarSolicitudEquipo//

CREATE DEFINER=`root`@`localhost` PROCEDURE `RechazarSolicitudEquipo`(IN p_id_solicitud INT)
BEGIN
UPDATE prestamoequipo
SET Estatus = 'RECHAZADA'
WHERE ID_PrestamoEquipo = p_id_solicitud;
END//
DELIMITER ;



-- SP APROBADO DE SOLICITUD DE EQUIPO


DELIMITER //

DROP PROCEDURE IF EXISTS AprobarEquipoSolicitud//

CREATE PROCEDURE AprobarEquipoSolicitud(
    IN p_id_solicitud INT, 
    IN p_id_admin INT      
)
BEGIN
    UPDATE prestamoequipo
    SET 
        Estatus = 'APROBADA',    
        ID_Admin_Aprueba = p_id_admin   
    WHERE 
        ID_PrestamoEquipo = p_id_solicitud;     
END//

DELIMITER ;


-- SP CONFIRMACION DE EQUIPO PRESTADO

DELIMITER //

DROP PROCEDURE IF EXISTS ConfirmarEquipoSolicitud//

CREATE PROCEDURE ConfirmarEquipoSolicitud(
    IN p_id_solicitud INT, 
    IN p_id_admin INT      
)
BEGIN
  
    UPDATE prestamoequipo
    SET 
        Estatus = 'CONFIRMADO',        
        Confirmado = 1,                 
        ID_Admin_Confirma = p_id_admin,
        Fecha_Hora_Confirmado = NOW()
    WHERE 
        ID_PrestamoEquipo = p_id_solicitud;     
END//

DELIMITER ;



-- SP DE CERRADO DE PRESTAMO DE SOLICITUD


DROP PROCEDURE IF EXISTS CerradoPrestamoSolicitud; 
DELIMITER //

CREATE PROCEDURE CerradoPrestamoSolicitud(
    IN p_id_prestamo INT,
    IN p_observaciones VARCHAR(250),
    IN p_anomalia TINYINT(1)
)
BEGIN
    UPDATE prestamoequipo
    SET 
        Estatus = 'CERRADO',
        Fecha_Hora_Cerrado = NOW(),
        Liberado = 1,
        Anomalia = p_anomalia,
        Observaciones = p_observaciones
    WHERE ID_PrestamoEquipo = p_id_prestamo;
END //

DELIMITER ;


-- ACCEDER A LA TABLA CONFIGURACION

DROP PROCEDURE IF EXISTS ObtenerConfiguracion;
DELIMITER //

CREATE PROCEDURE ObtenerConfiguracion()
BEGIN
  SELECT Id, Clave, Descripcion, Valor, FechaCreo, FechaModifico, Fecha_InicioClases, Fecha_FinClases FROM configuracion LIMIT 1;
END //

DELIMITER ;


-- SP DE UPDATE DE FECHA DE INICIO DE CLASES Y FIN (PARTICULARES)

DELIMITER //

DROP PROCEDURE IF EXISTS ActualizarConfiguracion//

CREATE PROCEDURE `ActualizarConfiguracion`(
    IN `p_Fecha_InicioClases` DATE,
    IN `p_Fecha_FinClases` DATE
)
BEGIN
    
    UPDATE `configuracion`
    SET 
        `Fecha_InicioClases` = p_Fecha_InicioClases,
        `Fecha_FinClases` = p_Fecha_FinClases,
        `FechaModifico` = CURRENT_TIMESTAMP
    WHERE `Id` = 1;
END //

DELIMITER ;


-- SP DE UPDATE DE FECHAS DE INSCRIPCION

DELIMITER //

DROP PROCEDURE IF EXISTS ActualizarFechaInscripcion//

CREATE PROCEDURE ActualizarFechaInscripcion(
    IN p_fecha_inicio TIMESTAMP,
    IN p_fecha_fin TIMESTAMP
)
BEGIN
    UPDATE habilitarinscripcion
    SET 
        fecha_inicio = p_fecha_inicio,
        fecha_fin = p_fecha_fin
    WHERE 
        id = 1;
END //

DELIMITER ;


-- ACTUALIZACION SP PARA VALIDACION DE MAESTROS


DELIMITER //

DROP PROCEDURE IF EXISTS AprobarEquipoSolicitud//

CREATE PROCEDURE AprobarEquipoSolicitud(
    IN p_id_solicitud INT, 
    IN p_id_admin INT
)
BEGIN
    DECLARE v_fecha_hora_inicio DATETIME;
    DECLARE v_fecha_hora_fin DATETIME;
    DECLARE v_id_usuario INT;
    DECLARE v_rol INT;

    -- Obtener la fecha y hora de inicio y fin de la solicitud, y el ID del usuario que la hizo
    SELECT Fecha_Hora_Inicio, Fecha_Hora_Fin, ID_Usuario_Pide
    INTO v_fecha_hora_inicio, v_fecha_hora_fin, v_id_usuario
    FROM prestamoequipo
    WHERE ID_PrestamoEquipo = p_id_solicitud;

    SELECT PerfilId INTO v_rol
    FROM usuario
    WHERE Id = v_id_usuario;

    -- Si el usuario es Maestro (PerfilId = 2)
    IF v_rol = 2 THEN
        UPDATE prestamoequipo
        SET Estatus = 'RECHAZADA'
        WHERE 
            ID_Equipo = (SELECT ID_Equipo FROM prestamoequipo WHERE ID_PrestamoEquipo = p_id_solicitud)
            AND Confirmado = 0
            AND ID_PrestamoEquipo != p_id_solicitud
            AND (
                (Fecha_Hora_Inicio BETWEEN v_fecha_hora_inicio AND v_fecha_hora_fin) OR
                (Fecha_Hora_Fin BETWEEN v_fecha_hora_inicio AND v_fecha_hora_fin) OR
                (v_fecha_hora_inicio BETWEEN Fecha_Hora_Inicio AND Fecha_Hora_Fin)
            );
    END IF;

    -- Aprobar la solicitud original
    UPDATE prestamoequipo
    SET 
        Estatus = 'APROBADA',
        ID_Admin_Aprueba = p_id_admin
    WHERE 
        ID_PrestamoEquipo = p_id_solicitud;
END//

DELIMITER ;

-- SP PARA OBTENER LOS SEMESTRES DISPONIBLES DE LOS GRUPOS 

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerSemestresDisponibles//

CREATE PROCEDURE ObtenerSemestresDisponibles()
BEGIN
    SELECT DISTINCT
        CONCAT(
            CASE 
                WHEN MONTH(FechaCreo) BETWEEN 1 AND 6 THEN 'ENERO-JUNIO ' 
                WHEN MONTH(FechaCreo) BETWEEN 8 AND 12 THEN 'AGOSTO-DICIEMBRE ' 
                ELSE 'SEMESTRE DESCONOCIDO '
            END,
            YEAR(FechaCreo)
        ) AS Semestre
    FROM grupo
    ORDER BY FechaCreo DESC;
END//

DELIMITER ;



-- MODIFICACION DEL SP DE GRUPOS

DROP PROCEDURE IF EXISTS QueryGrupo;
DELIMITER ;;
CREATE PROCEDURE `QueryGrupo`(
    IN `_Cantidad` INT, 
    IN `_MateriaId` INT, 
    IN `_Nombre` VARCHAR(128), 
    IN `_Dia` VARCHAR(32), 
    IN `_HoraInicio` VARCHAR(32), 
    IN `_HoraFin` VARCHAR(32), 
    IN `_MaestroId` INT,
    IN `_Semestre` VARCHAR(128)  
)
BEGIN
    SELECT 
        Grupo.Id, 
        MateriaId, 
        Materia.Nombre AS Materia, 
        Grupo.Nombre AS Nombre, 
        Aula, 
        Dia, 
        HoraInicio, 
        HoraFin, 
        Limite, 
        Sesiones, 
        MaestroId,
        CONCAT(
            (SELECT CONVERT(Count(UsuarioId), CHAR) 
             FROM UsuarioGrupo 
             WHERE UsuarioGrupo.GrupoId = Grupo.Id), 
            "/", 
            CONVERT(Limite, CHAR)
        ) AS Inscritos, 
        CONCAT(Maestro.Nombre, ' ', Maestro.ApPaterno, ' ', Maestro.ApMaterno) AS Encargado
    FROM 
        Grupo
    LEFT JOIN 
        Materia ON Materia.Id = MateriaId
    LEFT JOIN 
        Usuario AS Maestro ON MaestroId = Maestro.Id
    WHERE 
        (MateriaId = _MateriaId OR _MateriaId IS NULL) AND
        (Grupo.Nombre = _Nombre OR _Nombre = "" OR _Nombre IS NULL) AND
        (Dia = _Dia OR _Dia = "TS") AND
        (HoraInicio >= _HoraInicio) AND
        (HoraFin <= _HoraFin) AND
        (MaestroId = _MaestroId OR _MaestroId = 0) AND
        (Grupo.Semestre = _Semestre OR _Semestre IS NULL) AND 
        Grupo.Activo = TRUE
    LIMIT _Cantidad;
END ;;
DELIMITER ;


-- CAMBIO DEL SP DE LAS BUSQUEDAS DE GRUPOS A TRAVES DE LAS MATERIAS, AHORA SE TOMA EN CUENTA EL SEMESTRE.

DELIMITER //


DROP PROCEDURE IF EXISTS Grupos_Materia//


CREATE DEFINER=`root`@`localhost` PROCEDURE `Grupos_Materia`(
    IN _idMateria INT UNSIGNED,
    IN _Semestre VARCHAR(128)
)
BEGIN 
    SELECT 	G.Id,
            G.Nombre 
    FROM Grupo G
    WHERE G.MateriaId = _idMateria 
      AND (G.Semestre = _Semestre OR _Semestre IS NULL) 
      AND G.activo = 1;
END//

DELIMITER ;

-- CAMBIO DE SP DE LA BUSQUEDA DE GRUPOS 

DELIMITER //


DROP PROCEDURE IF EXISTS QueryUsuarioGrupo//

CREATE DEFINER=`root`@`localhost` PROCEDURE `QueryUsuarioGrupo`(
    IN `_Cantidad` INT, 
    IN `_UsuarioId` INT, 
    IN `_MateriaId` INT, 
    IN `_Nombre` VARCHAR(128), 
    IN `_Dia` VARCHAR(128), 
    IN `_HoraInicio` VARCHAR(32), 
    IN `_HoraFin` VARCHAR(32), 
    IN `_Matricula` INT, 
    IN `_GrupoId` INT, 
    IN `_MaestroId` INT,
    IN `_Semestre` VARCHAR(128) -- Agregamos el semestre como parámetro
)
    READS SQL DATA
SELECT 
    M.Nombre AS Materia, 
    G.Nombre as Nombre, 
    G.Aula as Aula, 
    G.Dia AS Dia, 
    G.HoraInicio AS HoraInicio, 
    G.HoraFin AS HoraFin, 
    G.Id AS Id, 
    concat_ws(' ', U.Nombre, U.ApPaterno, U.ApMaterno) AS Alumno, 
    U.Matricula AS Matricula 
FROM 
    UsuarioGrupo AS UG
    LEFT JOIN Grupo AS G ON UG.GrupoId = G.Id
    LEFT JOIN Materia AS M ON G.MateriaId = M.Id
    LEFT JOIN Usuario AS U ON UG.UsuarioId = U.Id
WHERE 
    (UG.UsuarioId = _UsuarioId OR _UsuarioId = 0) AND
    (G.MateriaId = _MateriaId OR _MateriaId IS NULL) AND
    (G.Nombre LIKE CONCAT("%", _Nombre, "%") OR _Nombre = "") AND
    (G.Dia = _Dia OR _Dia = "TS") AND
    (G.HoraInicio >= _HoraInicio) AND
    (G.HoraFin <= _HoraFin) AND
    (U.Matricula LIKE CONCAT("%", _Matricula, "%") OR _Matricula IS NULL) AND
    (UG.GrupoId = _GrupoId OR _GrupoId = 0) AND
    (G.MaestroId = _MaestroId OR _MaestroId = 0) AND 
    (G.Semestre = _Semestre OR _Semestre IS NULL) AND -- Filtra por semestre
    G.Activo = 1
LIMIT _Cantidad//

DELIMITER ;

-- CAMBIOS EN EL SP DE OBTENER HISTORIAL DE AULAS POR USUARIO

DELIMITER //


DROP PROCEDURE IF EXISTS GetSolicitudes//
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSolicitudes`(IN p_usuario_actual INT)
BEGIN
    SELECT 
        pa.ID_Prestamo AS id_solicitud,
        a.nombre AS nombre_aula, 
        pa.ID_Aula,
        DATE(pa.Fecha_Alta) AS fecha_alta_solicitud,
        DATE(pa.Fecha_Hora_Inicio) AS fecha_solicitud,
        TIME(pa.Fecha_Hora_Inicio)AS fecha_hora_inicio,
        TIME(pa.Fecha_Hora_Fin) AS fecha_hora_fin,
        pa.Estatus AS estado_solicitud
    FROM PrestamoAula pa
    JOIN Aula a ON pa.ID_Aula = a.id 
    WHERE pa.ID_Usuario_Pide = p_usuario_actual AND pa.activo = 1
    ORDER BY pa.ID_Prestamo DESC;
END//
DELIMITER ;

-- CAMBIO EN LOGIN PARA QUE EL USUARIO SEA BANEADO

DELIMITER //

DROP PROCEDURE IF EXISTS Login//

CREATE DEFINER=root@localhost PROCEDURE Login(
	_Matricula INT UNSIGNED
)
BEGIN
	SELECT 
		Id,
        Matricula,
		TRIM(CONCAT(IFNULL(Nombre, ""), " ", IFNULL(ApPaterno, ""), " ", IFNULL(ApMaterno, ""), " ")) Nombre,
        Correo,
        Contrasena,
        PerfilId,
        Baneado,
        motivoBaneo
    FROM Usuario WHERE Matricula = _Matricula;
END//
DELIMITER ; 

-- CAMBIO SP ELIMINACION DE PRESTAMOAULA

DELIMITER //

DROP PROCEDURE IF EXISTS DeleteSolicitud//

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteSolicitud`(IN p_id_solicitud INT)
BEGIN
UPDATE prestamoaula
SET activo = 0
WHERE ID_Prestamo = p_id_solicitud;
END//
DELIMITER ;



DELIMITER //

DROP PROCEDURE IF EXISTS DeleteSolicitudEquipo//

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteSolicitudEquipo`(IN p_id_solicitud INT)
BEGIN
UPDATE prestamoequipo
SET activo = 0
WHERE ID_PrestamoEquipo = p_id_solicitud;
END//
DELIMITER ;

-- CAMBIO EN EL PROCEDURE DE DAR DE ALTA LA MATERIA -- SE HARDCODEO LMAD DE MOMENTO POR LA IMPORTACION DE EXCEL

DELIMITER //

DROP PROCEDURE IF EXISTS AddMateria//

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddMateria`(
    _Nombre VARCHAR(128)
)
BEGIN
	INSERT INTO Materia(Nombre, carrera)
    VALUES(_Nombre, "LMAD");
END//
DELIMITER ;

-- CAMBIO SP GRUPOS MATERIAS PARA QUE SE TOME EN CUENTA EL ID DEL MAESTRO

DELIMITER //

DROP PROCEDURE IF EXISTS Grupos_Materia//

CREATE DEFINER=`root`@`localhost` PROCEDURE `Grupos_Materia`(
    IN _idMateria INT UNSIGNED,
    IN _Semestre VARCHAR(128),
    IN _UsuarioId INT UNSIGNED,
    IN _PerfilId INT UNSIGNED
)
BEGIN
    IF _PerfilId != 1 THEN
        -- Filtrar por el maestro asociado al usuario
        SELECT 
            G.Id,
            G.Nombre 
        FROM 
            Grupo G
        WHERE 
            G.MateriaId = _idMateria
            AND (G.Semestre = _Semestre OR _Semestre IS NULL)
            AND G.Activo = 1
            AND G.MaestroId = _UsuarioId;
    ELSE
        -- Realizar la búsqueda sin filtrar por maestro
        SELECT 
            G.Id,
            G.Nombre 
        FROM 
            Grupo G
        WHERE 
            G.MateriaId = _idMateria
            AND (G.Semestre = _Semestre OR _Semestre IS NULL)
            AND G.Activo = 1;
    END IF;
END//

DELIMITER ;


-- SE AGREGO EL SP DE INSERTAR EQUIPO

DELIMITER //

DROP PROCEDURE IF EXISTS InsertarEquipo//


CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarEquipo`(
    IN p_nombre VARCHAR(255)
)
BEGIN
    DECLARE existe INT;

    -- Convertir el nombre a mayúsculas para evitar duplicados por caso
    SET p_nombre = UPPER(p_nombre);

    -- Verificar si ya existe un equipo activo con el mismo nombre
    SELECT COUNT(*) INTO existe
    FROM equipo
    WHERE nombre = p_nombre AND activo = 1;

    IF existe > 0 THEN
        -- Si el equipo ya existe y está activo, devolver un mensaje de error
        SELECT 'Error: El equipo ya existe y está activo.' AS mensaje;
    ELSE
        -- Si el equipo no existe o está inactivo, insertar o actualizar el registro
        INSERT INTO equipo (nombre, activo)
        VALUES (p_nombre, 1)
        ON DUPLICATE KEY UPDATE activo = 1;

        -- Devolver un mensaje de éxito
        SELECT 'Equipo agregado o activado exitosamente.' AS mensaje;
    END IF;
END//
DELIMITER ;


-- SP REPORTES DE TICKETS


DELIMITER //

DROP PROCEDURE IF EXISTS ReporteTicketsPorSemestre//


CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteTicketsPorSemestre`()
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS TempReporteTickets (
        Semestre VARCHAR(50),
        TotalTickets INT,
        TicketsCerrados INT,
        TicketsSoporte INT,
        PorcentajeEfectividad DECIMAL(5,2)
    );

    INSERT INTO TempReporteTickets (Semestre, TotalTickets, TicketsCerrados, TicketsSoporte, PorcentajeEfectividad)
    SELECT 
        CONCAT('ENERO-JUNIO ', YEAR(fecha_alta_ticket)) AS Semestre,
        COUNT(*) AS TotalTickets,
        SUM(CASE WHEN estado_ticket = 'CERRADO' THEN 1 ELSE 0 END) AS TicketsCerrados,
        SUM(CASE WHEN soporte = 1 THEN 1 ELSE 0 END) AS TicketsSoporte,
        IF(COUNT(*) > 0, (SUM(CASE WHEN estado_ticket = 'CERRADO' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) AS PorcentajeEfectividad
    FROM ticket
    WHERE 
        MONTH(fecha_alta_ticket) BETWEEN 1 AND 6
        AND activo_ticket = 1 
    GROUP BY YEAR(fecha_alta_ticket);

    INSERT INTO TempReporteTickets (Semestre, TotalTickets, TicketsCerrados, TicketsSoporte, PorcentajeEfectividad)
    SELECT 
        CONCAT('AGOSTO-DICIEMBRE ', YEAR(fecha_alta_ticket)) AS Semestre,
        COUNT(*) AS TotalTickets,
        SUM(CASE WHEN estado_ticket = 'CERRADO' THEN 1 ELSE 0 END) AS TicketsCerrados,
        SUM(CASE WHEN soporte = 1 THEN 1 ELSE 0 END) AS TicketsSoporte,
        IF(COUNT(*) > 0, (SUM(CASE WHEN estado_ticket = 'CERRADO' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 0) AS PorcentajeEfectividad
    FROM ticket
    WHERE 
        MONTH(fecha_alta_ticket) BETWEEN 7 AND 12
        AND activo_ticket = 1 
    GROUP BY YEAR(fecha_alta_ticket);

    SELECT * FROM TempReporteTickets;

    DROP TEMPORARY TABLE TempReporteTickets;
END//

DELIMITER ;


-- SP REPORTE POR MATERIAS
DELIMITER //


DROP PROCEDURE IF EXISTS ReporteAlumnosPorMateria//


CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteAlumnosPorMateria`()
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS TempReporteMaterias (
        Semestre VARCHAR(50),
        Materia VARCHAR(255),
        TotalAlumnos INT
    );

    INSERT INTO TempReporteMaterias (Semestre, Materia, TotalAlumnos)
    SELECT 
        CONCAT('ENERO-JUNIO ', YEAR(g.FechaCreo)) AS Semestre,
        m.Nombre AS Materia,
        COUNT(DISTINCT ug.UsuarioId) AS TotalAlumnos
    FROM 
        grupo AS g
        LEFT JOIN UsuarioGrupo AS ug ON g.Id = ug.GrupoId AND ug.activo = 1 
        LEFT JOIN materia AS m ON g.MateriaId = m.Id
    WHERE 
        MONTH(g.FechaCreo) BETWEEN 1 AND 6
        AND g.Activo = 1 
    GROUP BY m.Nombre, YEAR(g.FechaCreo);

    INSERT INTO TempReporteMaterias (Semestre, Materia, TotalAlumnos)
    SELECT 
        CONCAT('AGOSTO-DICIEMBRE ', YEAR(g.FechaCreo)) AS Semestre,
        m.Nombre AS Materia,
        COUNT(DISTINCT ug.UsuarioId) AS TotalAlumnos
    FROM 
        grupo AS g
        LEFT JOIN UsuarioGrupo AS ug ON g.Id = ug.GrupoId AND ug.activo = 1  
        LEFT JOIN materia AS m ON g.MateriaId = m.Id
    WHERE 
        MONTH(g.FechaCreo) BETWEEN 7 AND 12
        AND g.Activo = 1 
    GROUP BY m.Nombre, YEAR(g.FechaCreo);

    SELECT 
        Semestre,
        Materia,
        SUM(TotalAlumnos) AS TotalAlumnos
    FROM 
        TempReporteMaterias
    GROUP BY Materia, Semestre
    ORDER BY 
        FIELD(Semestre, 'AGOSTO-DICIEMBRE 2024', 'ENERO-JUNIO 2024', 'AGOSTO-DICIEMBRE 2023', 'ENERO-JUNIO 2023', 'AGOSTO-DICIEMBRE 2022', 'ENERO-JUNIO 2022') DESC;

    DROP TEMPORARY TABLE TempReporteMaterias;
END//
DELIMITER ;

DELIMITER //

DROP PROCEDURE IF EXISTS ObtenerCountSolicitudes//


CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerCountSolicitudes`(
    IN p_id_aula INT,                   
    IN p_fecha DATE,                     
    IN p_hora_inicio DATETIME,          
    IN p_hora_fin DATETIME           
)
BEGIN
    SELECT 
        COUNT(*) AS TotalSolicitudes      
    FROM prestamoaula pa
    JOIN aula a ON pa.ID_Aula = a.id    
    WHERE 
        pa.ID_Aula = p_id_aula AND       
        pa.Estatus IN ('APROBADA', 'CONFIRMADO') AND 
        DATE(pa.Fecha_Hora_Inicio) = p_fecha AND  
        pa.Fecha_Hora_Inicio < p_hora_fin AND     
        pa.Fecha_Hora_Fin > p_hora_inicio;     
END//
DELIMITER ;


DELIMITER //

DROP PROCEDURE IF EXISTS AprobarAulaSolicitud//

CREATE PROCEDURE AprobarAulaSolicitud(
    IN p_id_solicitud INT, 
    IN p_id_admin INT
)
BEGIN
    DECLARE v_fecha_hora_inicio DATETIME;
    DECLARE v_fecha_hora_fin DATETIME;
    DECLARE v_id_usuario INT;
    DECLARE v_rol INT;

    -- Obtener la fecha y hora de inicio y fin de la solicitud, y el ID del usuario que la hizo
    SELECT Fecha_Hora_Inicio, Fecha_Hora_Fin, ID_Usuario_Pide
    INTO v_fecha_hora_inicio, v_fecha_hora_fin, v_id_usuario
    FROM prestamoaula
    WHERE ID_Prestamo = p_id_solicitud;

    -- Obtener el perfil del usuario (rol)
    SELECT PerfilId INTO v_rol
    FROM usuario
    WHERE Id = v_id_usuario;

    -- Si el usuario es Maestro (PerfilId = 2), se rechazan solicitudes que tengan conflicto de horario
    IF v_rol = 2 THEN
        UPDATE prestamoaula
        SET Estatus = 'RECHAZADA'
        WHERE 
            ID_Aula = (SELECT ID_Aula FROM prestamoaula WHERE ID_Prestamo = p_id_solicitud)
            AND Confirmado = 0
            AND ID_Prestamo != p_id_solicitud
            AND (
                (Fecha_Hora_Inicio BETWEEN v_fecha_hora_inicio AND v_fecha_hora_fin) OR
                (Fecha_Hora_Fin BETWEEN v_fecha_hora_inicio AND v_fecha_hora_fin) OR
                (v_fecha_hora_inicio BETWEEN Fecha_Hora_Inicio AND Fecha_Hora_Fin)
            );
    END IF;

    -- Aprobar la solicitud original
    UPDATE prestamoaula
    SET 
        Estatus = 'APROBADA',
        ID_Admin_Aprueba = p_id_admin
    WHERE 
        ID_Prestamo = p_id_solicitud;
END//

DELIMITER ;


DELIMITER //

DROP PROCEDURE IF EXISTS AddSolicitud//

CREATE DEFINER=`root`@`localhost` PROCEDURE AddSolicitud(
    IN p_id_aula INT,
    IN p_id_usuario_pide INT,
    IN p_fecha_alta DATETIME,
    IN p_fecha_hora_inicio DATETIME,
    IN p_fecha_hora_fin DATETIME
)
BEGIN
    DECLARE p_id_solicitud INT; 
    DECLARE p_rol_usuario INT;
    DECLARE p_capacidad_aula INT;
    DECLARE p_count_solicitudes INT;

    -- Obtener el perfil (rol) del usuario
    SELECT PerfilId INTO p_rol_usuario
    FROM Usuario
    WHERE Id = p_id_usuario_pide;

    -- Validar si el usuario tiene el rol diferente de 2 (maestro)
    IF p_rol_usuario != 2 THEN
        SELECT pa.ID_Prestamo INTO p_id_solicitud
        FROM PrestamoAula pa
        WHERE pa.ID_Usuario_Pide = p_id_usuario_pide
          AND DATE(pa.Fecha_Hora_Inicio) = DATE(p_fecha_hora_inicio)
          AND pa.Estatus != 'RECHAZADA'; 

        IF p_id_solicitud IS NOT NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Ya existe una solicitud enviada en esta fecha que no ha sido rechazada.';
        END IF;
    END IF;

    -- Verificar si ya hay una solicitud de maestro aprobada o confirmada en el horario
    SELECT pa.ID_Prestamo INTO p_id_solicitud
    FROM PrestamoAula pa
    JOIN Usuario u ON pa.ID_Usuario_Pide = u.Id
    WHERE 
        u.PerfilId = 2 AND 
        pa.Estatus IN ('APROBADA', 'CONFIRMADA') AND
        (
            (pa.Fecha_Hora_Inicio < p_fecha_hora_fin AND pa.Fecha_Hora_Fin > p_fecha_hora_inicio) 
            OR 
            (DATE(pa.Fecha_Hora_Inicio) = DATE(p_fecha_hora_inicio)) AND 
            (pa.Fecha_Hora_Inicio <= p_fecha_hora_inicio AND pa.Fecha_Hora_Fin >= p_fecha_hora_fin)
        );

    IF p_id_solicitud IS NOT NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Ya existe una solicitud de un maestro aprobada o confirmada en este horario.';
    END IF;

    -- Obtener la capacidad del aula
    SELECT Capacidad INTO p_capacidad_aula
    FROM Aula
    WHERE ID = p_id_aula;

    -- Calcular la cantidad de solicitudes para el aula en el horario especificado
    SELECT COUNT(*) INTO p_count_solicitudes
    FROM PrestamoAula pa
    JOIN Aula a ON pa.ID_Aula = a.id    
    WHERE 
        pa.ID_Aula = p_id_aula AND
        pa.Estatus IN ('APROBADA', 'CONFIRMADO') AND 
        DATE(pa.Fecha_Hora_Inicio) = DATE(p_fecha_hora_inicio) AND  
        pa.Fecha_Hora_Inicio < p_fecha_hora_fin AND     
        pa.Fecha_Hora_Fin > p_fecha_hora_inicio;

    -- Verificar si el número de solicitudes ha alcanzado el límite y si el rol es diferente de 2
    IF p_count_solicitudes >= p_capacidad_aula AND p_rol_usuario != 2 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Se ha alcanzado el límite de solicitudes para esta aula en el horario especificado.';
    END IF;

    -- Insertar la nueva solicitud
    INSERT INTO prestamoaula (
        ID_Aula, 
        ID_Usuario_Pide, 
        Fecha_Alta, 
        Fecha_Hora_Inicio, 
        Fecha_Hora_Fin
    ) 
    VALUES (
        p_id_aula,                       
        p_id_usuario_pide,                
        NOW(),                      
        p_fecha_hora_inicio,              
        p_fecha_hora_fin                   
    );

END//

DELIMITER ;



DELIMITER //

DROP PROCEDURE IF EXISTS QueryGrupo//

CREATE DEFINER=`root`@`localhost` PROCEDURE `QueryGrupo`(
    IN `_Cantidad` INT, 
    IN `_MateriaId` INT, 
    IN `_Nombre` VARCHAR(128), 
    IN `_Dia` VARCHAR(32), 
    IN `_HoraInicio` VARCHAR(32), 
    IN `_HoraFin` VARCHAR(32), 
    IN `_MaestroId` INT,
    IN `_Semestre` VARCHAR(128) -- Nuevo parámetro
)
BEGIN
    SELECT 
        Grupo.Id, 
        MateriaId, 
        Materia.Nombre AS Materia, 
        Grupo.Nombre AS Nombre, 
        Aula, 
        Dia, 
        HoraInicio, 
        HoraFin, 
        Limite, 
        Sesiones, 
        MaestroId,
        Semestre,
        CONCAT(
            (SELECT CONVERT(COUNT(UsuarioId), CHAR) 
             FROM UsuarioGrupo 
             WHERE UsuarioGrupo.GrupoId = Grupo.Id), 
            "/", 
            CONVERT(Limite, CHAR)
        ) AS Inscritos, 
        CONCAT(Maestro.Nombre, ' ', Maestro.ApPaterno, ' ', Maestro.ApMaterno) AS Encargado
    FROM 
        Grupo
    LEFT JOIN 
        Materia ON Materia.Id = MateriaId
    LEFT JOIN 
        Usuario AS Maestro ON MaestroId = Maestro.Id
    WHERE 
        (MateriaId = _MateriaId OR _MateriaId IS NULL) AND
        (Grupo.Nombre = _Nombre OR _Nombre = "" OR _Nombre IS NULL) AND
        (Dia = _Dia OR _Dia = "TS") AND
        (HoraInicio >= _HoraInicio) AND
        (HoraFin <= _HoraFin) AND
        (MaestroId = _MaestroId OR _MaestroId = 0) AND
        (Semestre = _Semestre OR _Semestre IS NULL) AND -- Filtro por semestre
        Grupo.Activo = TRUE
    ORDER BY 
        Grupo.FechaCreo DESC
    LIMIT _Cantidad;
END//
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `QueryGrupo`(
    IN `_Cantidad` INT, 
    IN `_MateriaId` INT, 
    IN `_Nombre` VARCHAR(128), 
    IN `_Dia` VARCHAR(32), 
    IN `_HoraInicio` VARCHAR(32), 
    IN `_HoraFin` VARCHAR(32), 
    IN `_MaestroId` INT,
    IN `_Semestre` VARCHAR(128) -- Nuevo parámetro
)
BEGIN
    SELECT 
        Grupo.Id, 
        MateriaId, 
        Materia.Nombre AS Materia, 
        Grupo.Nombre AS Nombre, 
        Aula, 
        Dia, 
        HoraInicio, 
        HoraFin, 
        Limite, 
        Sesiones, 
        MaestroId,
        Semestre,
        CONCAT(
            (SELECT CONVERT(COUNT(UsuarioId), CHAR) 
             FROM UsuarioGrupo 
             WHERE UsuarioGrupo.GrupoId = Grupo.Id AND UsuarioGrupo.activo = 1), 
            "/", 
            CONVERT(Limite, CHAR)
        ) AS Inscritos, 
        CONCAT(Maestro.Nombre, ' ', Maestro.ApPaterno, ' ', Maestro.ApMaterno) AS Encargado
    FROM 
        Grupo
    LEFT JOIN 
        Materia ON Materia.Id = MateriaId
    LEFT JOIN 
        Usuario AS Maestro ON MaestroId = Maestro.Id
    WHERE 
        (MateriaId = _MateriaId OR _MateriaId IS NULL) AND
        (Grupo.Nombre = _Nombre OR _Nombre = "" OR _Nombre IS NULL) AND
        (Dia = _Dia OR _Dia = "TS") AND
        (HoraInicio >= _HoraInicio) AND
        (HoraFin <= _HoraFin) AND
        (MaestroId = _MaestroId OR _MaestroId = 0) AND
        (Semestre = _Semestre OR _Semestre IS NULL) AND -- Filtro por semestre
        Grupo.Activo = TRUE
    ORDER BY 
        Grupo.FechaCreo DESC
    LIMIT _Cantidad;
END$$
DELIMITER ;


