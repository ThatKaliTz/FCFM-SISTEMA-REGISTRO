

UPDATE grupo SET Activo = 1;



ALTER TABLE materia
ADD COLUMN activo TINYINT(1) DEFAULT 1;



ALTER TABLE usuario
ADD COLUMN activo TINYINT(1) DEFAULT 1;


ALTER TABLE usuario
ADD COLUMN baneado TINYINT(1) DEFAULT 0;


ALTER TABLE usuario
ADD COLUMN motivoBaneo VARCHAR(255);



ALTER TABLE usuariogrupo
ADD COLUMN activo TINYINT(1) DEFAULT 1;



DROP TABLE IF EXISTS Aula;
CREATE TABLE Aula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO Aula (nombre, activo) VALUES
('205', 1),
('206', 1),
('210', 1),
('212', 1),
('VIRTUAL', 1),
('LBF', 1),
('LE', 1),
('LMR', 1);




ALTER TABLE perfil
ADD COLUMN activo TINYINT(1) DEFAULT 1;




ALTER TABLE ticket
ADD COLUMN motivo_administrador VARCHAR(250) DEFAULT NULL;




ALTER TABLE ticket
ADD COLUMN id_admin INT(11) DEFAULT NULL;




ALTER TABLE Aula
ADD COLUMN Capacidad INT;




DROP TABLE IF EXISTS HorariosAulas;

CREATE TABLE HorariosAulas (
  id INT(11) NOT NULL AUTO_INCREMENT,
  id_aula INT(11) NOT NULL, 
  dia_semana ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NOT NULL, 
  hora_inicio TIME NOT NULL, 
  hora_fin TIME NOT NULL, 
  es_clase TINYINT(1) NOT NULL DEFAULT 1, 
  PRIMARY KEY (id),
  FOREIGN KEY (id_aula) REFERENCES aula(id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



DROP TABLE IF EXISTS PrestamoAula;


CREATE TABLE PrestamoAula (
    ID_Prestamo INT AUTO_INCREMENT PRIMARY KEY,
    ID_Aula INT NOT NULL,
    ID_Usuario_Pide INT NOT NULL,
    Estatus VARCHAR(200) NOT NULL DEFAULT 'PENDIENTE',
    ID_Admin_Aprueba INT,
    Fecha_Alta DATETIME NOT NULL,
    Fecha_Hora_Inicio DATETIME,
    Fecha_Hora_Fin DATETIME,
    Fecha_Hora_Cerrado DATETIME,
    Fecha_Hora_Confirmación DATETIME,
    Anomalia TINYINT(1) DEFAULT 0,
    Observaciones VARCHAR(250) ,
    Confirmado TINYINT(1) DEFAULT 0,
    activo BIT DEFAULT 1, 
    ID_Admin_Confirma INT,
    Liberada TINYINT(1),
    CONSTRAINT FK_Aula FOREIGN KEY (ID_Aula) REFERENCES aula(id)
)





DROP TABLE IF EXISTS Solicitud;

CREATE TABLE Solicitud (
    id_solicitud INT AUTO_INCREMENT,
    aula_solicitud VARCHAR(100),
    maquina_solicitud VARCHAR(100) DEFAULT '',
    fecha_solicitud DATE,
    hora_inicio_solicitud TIME,
    hora_fin_solicitud TIME,
    creador_solicitud INT,
    tipo_solicitud VARCHAR(100),
    estado_solicitud VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    fecha_alta_solicitud TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_cambio_solicitud TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
    activo_solicitud INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id_solicitud)
);





ALTER TABLE Aula
ADD COLUMN prestable TINYINT(1) DEFAULT 1;







INSERT INTO perfil (Nombre, FechaCreo, FechaModifico, activo) 
VALUES ('Soporte', NOW(), NULL, 1);





ALTER TABLE ticket
ADD COLUMN soporte TINYINT(1) DEFAULT 0;






CREATE TABLE `prestamoequipo` (
  `ID_PrestamoEquipo` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Equipo` int(11) NOT NULL,
  `ID_Usuario_Pide` int(11) NOT NULL,
  `Estatus` varchar(200) NOT NULL DEFAULT 'PENDIENTE',
  `ID_Admin_Aprueba` int(11) DEFAULT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Fecha_Hora_Inicio` datetime DEFAULT NULL,
  `Fecha_Hora_Confirmado` datetime DEFAULT NULL,
  `Fecha_Hora_Fin` datetime DEFAULT NULL,
  `Fecha_Hora_Cerrado` datetime DEFAULT NULL,
  `Anomalia` tinyint(1) DEFAULT 0,
  `Observaciones` varchar(250) DEFAULT NULL,
  `Confirmado` tinyint(1) DEFAULT 0,
  `ID_Admin_Confirma` int(11) DEFAULT NULL,
  `Liberado` tinyint(1) DEFAULT NULL,
    `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ID_PrestamoEquipo`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `equipo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





ALTER TABLE `configuracion`
ADD COLUMN `Fecha_InicioClases` DATE NULL DEFAULT NULL,
ADD COLUMN `Fecha_FinClases` DATE NULL DEFAULT NULL;



UPDATE grupo
SET Semestre = CASE 
    WHEN MONTH(FechaCreo) BETWEEN 1 AND 6 THEN CONCAT('ENERO-JUNIO ', YEAR(FechaCreo))
    WHEN MONTH(FechaCreo) BETWEEN 8 AND 12 THEN CONCAT('AGOSTO-DICIEMBRE ', YEAR(FechaCreo))
    ELSE 'SEMESTRE DESCONOCIDO'
END;





ALTER TABLE `prestamoequipo`
  ADD CONSTRAINT `FK_ID_Equipo` FOREIGN KEY (`ID_Equipo`) REFERENCES `equipo` (`id`);




DELIMITER $$

CREATE TRIGGER `before_insert_grupo` 
BEFORE INSERT ON `grupo`
FOR EACH ROW 
BEGIN
    DECLARE grupoSecuencial INT;

    
    SET NEW.Semestre = CONCAT(
        CASE 
            WHEN MONTH(NEW.FechaCreo) BETWEEN 1 AND 7 THEN 'ENERO-JUNIO ' 
            WHEN MONTH(NEW.FechaCreo) BETWEEN 8 AND 12 THEN 'AGOSTO-DICIEMBRE ' 
            ELSE 'SEMESTRE DESCONOCIDO '
        END,
        YEAR(NEW.FechaCreo)
    );

    
    SELECT COUNT(*) + 1 
    INTO grupoSecuencial
    FROM Grupo 
    WHERE MateriaId = NEW.MateriaId 
      AND Semestre = NEW.Semestre 
      AND Activo = 1;

    
    SET NEW.Nombre = CONCAT('GRUPO ', grupoSecuencial);
END$$

DELIMITER ;
