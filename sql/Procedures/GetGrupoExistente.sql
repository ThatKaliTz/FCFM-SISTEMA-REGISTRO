DELIMITER ;;
-- Eliminar el procedimiento almacenado existente si existe
DROP PROCEDURE IF EXISTS `GetGrupoExistente`;;
CREATE PROCEDURE `GetGrupoExistente`(
	_MateriaId INT UNSIGNED,
    _Dia VARCHAR(32),
    _HoraInicio VARCHAR(32),
    _HoraFin VARCHAR(32)
)
BEGIN
	SELECT 
		Id,
        MateriaId,
		IFNULL(Nombre, "") Nombre,
		IFNULL(Dia, "") Dia,
		IFNULL(HoraInicio, "") HoraInicio,
		IFNULL(HoraFin, "") HoraFin
    FROM Grupo 
    WHERE 
    MateriaId = _MateriaId AND
    Dia = _Dia AND
    HoraInicio = _HoraInicio AND
    HoraFin = _HoraFin AND 
    Semestre = (SELECT Valor FROM Configuracion WHERE Clave = "Semestre" LIMIT 1)
    AND Activo = 1;
END ;;
DELIMITER ;