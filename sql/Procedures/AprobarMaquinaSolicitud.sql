USE siste133_sistemaregistro_dev;
DROP PROCEDURE IF EXISTS AprobarMaquinaSolicitud;
DELIMITER // CREATE PROCEDURE AprobarMaquinaSolicitud(
    IN p_id_solicitud INT,
    IN p_aula VARCHAR(100),
    IN p_maquina VARCHAR(100)
) BEGIN
UPDATE Solicitud
SET estado_solicitud = 'APROBADA',
    aula_solicitud = p_aula,
    maquina_solicitud = p_maquina
WHERE id_solicitud = p_id_solicitud;
END // DELIMITER ;