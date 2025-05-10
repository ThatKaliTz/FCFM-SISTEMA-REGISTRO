USE siste133_sistemaregistro_dev;
DROP PROCEDURE IF EXISTS GetSolicitudes;
DELIMITER // CREATE PROCEDURE GetSolicitudes(IN p_usuario_actual VARCHAR(100)) BEGIN
SELECT id_solicitud,
    aula_solicitud,
    maquina_solicitud,
    fecha_solicitud,
    hora_inicio_solicitud,
    hora_fin_solicitud,
    creador_solicitud,
    estado_solicitud,
    fecha_alta_solicitud,
    fecha_cambio_solicitud,
    activo_solicitud,
    tipo_solicitud
FROM Solicitud
WHERE creador_solicitud = p_usuario_actual AND activo_solicitud = 1
ORDER BY id_solicitud DESC;
END // DELIMITER ;