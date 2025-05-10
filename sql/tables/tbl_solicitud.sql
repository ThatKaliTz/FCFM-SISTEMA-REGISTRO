USE siste133_sistemaregistro_dev;
-- Eliminar la tabla si existe
DROP TABLE IF EXISTS Solicitud;
-- Estructura de la tabla Solicitud
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



DROP TABLE IF EXISTS PrestamoAula;
CREATE TABLE PrestamoAula (
    ID_Prestamo INT AUTO_INCREMENT PRIMARY KEY,
    ID_Aula INT,
    ID_Usuario_Pide INT,
    Estatus VARCHAR(200),
    ID_Admin_Aprueba INT,
    Fecha_Alta DATETIME,
    Fecha_Hora_Inicio DATETIME,
    Fecha_Hora_Fin DATETIME,
    Fecha_Hora_Cerrado DATETIME,
    Anomalia TINYINT(1),
    Observaciones VARCHAR(250),
    Confirmado TINYINT(1),
    ID_Admin_Confirma INT,
    Liberada TINYINT(1),
    CONSTRAINT FK_Aula FOREIGN KEY (ID_Aula) REFERENCES Aula(ID_Aula),
    CONSTRAINT FK_Usuario_Pide FOREIGN KEY (ID_Usuario_Pide) REFERENCES Usuarios(ID_Usuario),
    CONSTRAINT FK_Admin_Aprueba FOREIGN KEY (ID_Admin_Aprueba) REFERENCES Usuarios(ID_Usuario),
    CONSTRAINT FK_Admin_Confirma FOREIGN KEY (ID_Admin_Confirma) REFERENCES Usuarios(ID_Usuario)
);
