DELIMITER ;;
-- Eliminar el procedimiento almacenado existente si existe
DROP PROCEDURE IF EXISTS `QueryUsuariosEncargados`;;
CREATE PROCEDURE `QueryUsuariosEncargados`(
)
BEGIN

		SELECT 
			Id,
            Matricula,
            IFNULL(Nombre, "") Nombre,
            IFNULL(ApPaterno, "") ApPaterno,
            IFNULL(ApMaterno, "") ApMaterno,
            CONCAT(Nombre, ' ', ApPaterno, ' ', ApMaterno)  NombreCompleto,
			Correo,
            PerfilId
            
		FROM Usuario
        
        WHERE 
			(PerfilId IN (1, 2, 3));
        
END ;;
DELIMITER ;