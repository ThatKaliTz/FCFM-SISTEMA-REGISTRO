USE siste133_sistemaregistro_dev;
-- Eliminar el procedimiento almacenado si existe
DROP PROCEDURE IF EXISTS AddSolicitud;
-- Crear el procedimiento almacenado AddSolicitud
DELIMITER // CREATE PROCEDURE AddSolicitud(
    IN p_aula VARCHAR(100),
    IN p_fecha DATE,
    IN p_horaInicio TIME,
    IN p_horaFin TIME,
    IN p_creador INT,
    IN p_tipo VARCHAR(100)
) BEGIN
INSERT INTO Solicitud (
        aula_solicitud,
        fecha_solicitud,
        hora_inicio_solicitud,
        hora_fin_solicitud,
        creador_solicitud,
        tipo_solicitud
    )
VALUES (
        p_aula,
        p_fecha,
        p_horaInicio,
        p_horaFin,
        p_creador,
        p_tipo
    );
END // DELIMITER ;