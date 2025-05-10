USE siste133_sistemaregistro_dev;
DROP PROCEDURE IF EXISTS AprobarAulaSolicitud;
DELIMITER // CREATE PROCEDURE AprobarAulaSolicitud(IN p_id_solicitud INT) BEGIN
UPDATE Solicitud
SET estado_solicitud = 'APROBADA'
WHERE id_solicitud = p_id_solicitud;
END // DELIMITER ;