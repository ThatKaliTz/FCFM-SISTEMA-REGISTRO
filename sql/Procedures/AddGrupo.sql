DELIMITER ;;
-- Eliminar el procedimiento almacenado existente si existe
DROP PROCEDURE IF EXISTS `AddGrupo`;;
CREATE PROCEDURE `AddGrupo`(
    _MateriaId INT UNSIGNED,
    _Aula VARCHAR(32),
    _Dia VARCHAR(32),
    _HoraInicio VARCHAR(32),
    _HoraFin VARCHAR(32),
    _Limite INT,
    _Sesiones INT,
    _MaestroId INT
)
BEGIN
	SELECT @Semestre := Valor FROM Configuracion WHERE Clave = "Semestre" LIMIT 1;
	SELECT @Nombre := CONCAT('GRUPO ', COUNT(*) + 1) FROM Grupo WHERE MateriaId = _MateriaId AND Activo = 1;
    
	INSERT INTO Grupo (MateriaId, Nombre, Aula, Dia, HoraInicio, HoraFin, Limite, Sesiones, Semestre, MaestroId, Activo)
    VALUES(_MateriaId, @Nombre, _Aula, _Dia, _HoraInicio, _HoraFin, _Limite, _Sesiones, @Semestre, _MaestroId, 1);
END ;;
DELIMITER ;