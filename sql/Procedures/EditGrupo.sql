DELIMITER ;;
-- Eliminar el procedimiento almacenado existente si existe
DROP PROCEDURE IF EXISTS `EditGrupo`;;
CREATE PROCEDURE `EditGrupo`(
    _Id INT UNSIGNED,
    _Aula VARCHAR(32),
    _Dia VARCHAR(32),
    _HoraInicio VARCHAR(32),
    _HoraFin VARCHAR(32),
    _Limite INT,
    _Sesiones INT,
    _MaestroId	INT
)
BEGIN
	UPDATE Grupo
    SET 
		Dia = _Dia,
        Aula = _Aula,
        HoraInicio = _HoraInicio,
        HoraFin = _HoraFin,
        Limite = _Limite,
        Sesiones = _Sesiones,
        MaestroId = _MaestroId
    WHERE Id = _Id;
END ;;
DELIMITER ;