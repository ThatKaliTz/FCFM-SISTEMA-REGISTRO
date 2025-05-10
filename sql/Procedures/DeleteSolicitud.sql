USE siste133_sistemaregistro_dev;
DROP PROCEDURE IF EXISTS DeleteSolicitud;
DELIMITER // CREATE PROCEDURE DeleteSolicitud(IN p_id_solicitud INT) BEGIN
UPDATE Solicitud
SET activo_solicitud = 0
WHERE id_solicitud = p_id_solicitud;
END // DELIMITER ;