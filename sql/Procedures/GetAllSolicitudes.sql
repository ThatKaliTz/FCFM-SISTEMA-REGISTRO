USE siste133_sistemaregistro_dev;
DROP PROCEDURE IF EXISTS GetAllSolicitudes;
DELIMITER //
CREATE PROCEDURE GetAllSolicitudes()
BEGIN
    SELECT s.id_solicitud,
           s.aula_solicitud,
           s.fecha_solicitud,
           s.hora_inicio_solicitud,
           s.hora_fin_solicitud,
           CONCAT(u.Nombre, ' ', u.ApPaterno, ' ', u.ApMaterno) AS creador_nombre,
           s.creador_solicitud,
           p.Nombre AS perfil_nombre,
           s.estado_solicitud,
           s.fecha_alta_solicitud,
           s.fecha_cambio_solicitud,
           s.activo_solicitud,
           s.maquina_solicitud,
           s.tipo_solicitud
    FROM Solicitud s
    JOIN Usuario u ON s.creador_solicitud = u.Id
    JOIN Perfil p ON u.PerfilId = p.Id
    WHERE s.activo_solicitud = 1
    ORDER BY s.id_solicitud DESC;
END //
DELIMITER ;
