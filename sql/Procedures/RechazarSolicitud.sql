USE siste133_sistemaregistro_dev;
DROP PROCEDURE IF EXISTS RechazarSolicitud;
DELIMITER // CREATE PROCEDURE RechazarSolicitud(IN p_id_solicitud INT) BEGIN
UPDATE Solicitud
SET estado_solicitud = 'RECHAZADA'
WHERE id_solicitud = p_id_solicitud;
END // DELIMITER ;