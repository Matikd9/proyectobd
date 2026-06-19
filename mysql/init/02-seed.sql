SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

USE control_medico;

-- 1. Idiomas
INSERT INTO IDIOMA (id, nombre_idioma, codigo_locale) VALUES 
('es', 'Español', 'es-ES'),
('en', 'English', 'en-US');

-- 2. Enfermedades
INSERT INTO ENFERMEDAD (sigla) VALUES ('DBT'), ('HTA');

-- Traducciones Enfermedades
INSERT INTO ENFERMEDAD_TRADUCCION (id_enfermedad, id_idioma, nombre_enfermedad, descripcion) VALUES
(1, 'es', 'Diabetes', 'Enfermedad metabólica crónica'),
(1, 'en', 'Diabetes', 'Chronic metabolic disease'),
(2, 'es', 'Hipertensión', 'Presión arterial alta'),
(2, 'en', 'Hypertension', 'High blood pressure');

-- 3. Síntomas (9 síntomas)
INSERT INTO SINTOMA (sigla, categoria) VALUES 
('CEF', 'alta'), 
('FAT', 'media'), 
('MAR', 'baja'), 
('SED', 'media'), 
('VIS', 'alta'),
('POL', 'media'),
('ENT', 'media'),
('ZUM', 'baja'),
('PAL', 'alta');

-- Traducciones Síntomas
INSERT INTO SINTOMA_TRADUCCION (id_sintoma, id_idioma, nombre_sintoma, descripcion) VALUES
(1, 'es', 'Dolor de cabeza', 'Cefalea intensa'),
(1, 'en', 'Headache', 'Intense headache'),
(2, 'es', 'Fatiga', 'Cansancio extremo'),
(2, 'en', 'Fatigue', 'Extreme tiredness'),
(3, 'es', 'Mareos', 'Pérdida de equilibrio'),
(3, 'en', 'Dizziness', 'Loss of balance'),
(4, 'es', 'Sed excesiva', 'Polidipsia'),
(4, 'en', 'Excessive thirst', 'Polydipsia'),
(5, 'es', 'Visión borrosa', 'Dificultad para enfocar'),
(5, 'en', 'Blurred vision', 'Difficulty focusing'),
(6, 'es', 'Frecuencia urinaria', 'Poliuria o necesidad frecuente de orinar'),
(6, 'en', 'Frequent urination', 'Increased frequency of urination'),
(7, 'es', 'Entumecimiento en manos/pies', 'Parestesia en extremidades'),
(7, 'en', 'Numbness in hands/feet', 'Paresthesia in extremities'),
(8, 'es', 'Zumbido en oídos', 'Tinnitus o acúfenos'),
(8, 'en', 'Ringing in ears', 'Tinnitus'),
(9, 'es', 'Palpitaciones cardíacas', 'Percepción del latido cardíaco acelerado'),
(9, 'en', 'Heart palpitations', 'Sensation of rapid or irregular heartbeats');

-- 4. Médicos
INSERT INTO MEDICO (nombre, apellido, especialidad) VALUES
('Dr. Juan', 'Pérez', 'Endocrinología'),
('Dra. María', 'Gómez', 'Cardiología'),
('Dr. Carlos', 'López', 'Medicina General');

-- 5. Pacientes (10 pacientes con RUT e id_medico)
INSERT INTO PACIENTE (rut, nombre, apellido, fecha_nacimiento, genero, telefono, email, id_medico) VALUES
('15.234.567-8', 'Ana', 'Martínez', '1980-05-15', 'F', '+56911111111', 'ana@email.com', 1),
('16.789.012-3', 'Luis', 'Rodríguez', '1975-08-22', 'M', '+56922222222', 'luis@email.com', 2),
('12.345.678-9', 'Carmen', 'Sánchez', '1960-12-01', 'F', '+56933333333', 'carmen@email.com', 1),
('18.456.789-0', 'Pedro', 'Díaz', '1990-03-10', 'M', '+56944444444', 'pedro@email.com', 3),
('17.111.222-3', 'Laura', 'Muñoz', '1985-11-20', 'F', '+56955555555', 'laura@email.com', 1),
('14.333.444-5', 'Jorge', 'Rojas', '1970-07-08', 'M', '+56966666666', 'jorge@email.com', 2),
('10.555.666-7', 'Marta', 'Silva', '1955-02-14', 'F', '+56977777777', 'marta@email.com', 3),
('19.777.888-9', 'Diego', 'Soto', '1988-09-30', 'M', '+56988888888', 'diego@email.com', 2),
('13.999.000-K', 'Elena', 'Contreras', '1965-04-25', 'F', '+56999999999', 'elena@email.com', 1),
('11.222.333-4', 'Raúl', 'Morales', '1978-10-12', 'M', '+56900000000', 'raul@email.com', 3);

-- Asignar enfermedades a pacientes
INSERT INTO PACIENTE_ENFERMEDAD (id_paciente, id_enfermedad, fecha_diagnostico) VALUES
(1, 1, '2020-01-15'), (2, 2, '2019-05-20'), (3, 1, '2015-08-10'),
(4, 2, '2021-03-12'), (5, 1, '2022-11-05');

-- 6. Script para generar 1000 mediciones clínicas
DELIMITER //
CREATE PROCEDURE SeedMediciones()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE p_id INT;
  DECLARE m_id INT;
  DECLARE f_date DATETIME;
  DECLARE glucosa DECIMAL(6,2);
  DECLARE p_sist SMALLINT UNSIGNED;
  DECLARE p_diast SMALLINT UNSIGNED;
  DECLARE peso DECIMAL(5,2);
  DECLARE imc DECIMAL(4,2);
  DECLARE m_dia VARCHAR(10);
  DECLARE ayunas BOOLEAN;
  DECLARE p_heridas BOOLEAN;
  DECLARE p_ampollas BOOLEAN;
  DECLARE p_rojeces BOOLEAN;
  DECLARE p_color BOOLEAN;
  
  WHILE i < 1000 DO
    -- Random paciente (1 a 10)
    SET p_id = FLOOR(1 + (RAND() * 10));
    -- Random medico (1 a 3)
    SET m_id = FLOOR(1 + (RAND() * 3));
    -- Random date within last 6 months
    SET f_date = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 180) DAY);
    
    -- Random clinical data
    SET glucosa = ROUND(70 + (RAND() * 180), 2);
    SET p_sist = ROUND(90 + (RAND() * 90), 0);
    SET p_diast = ROUND(60 + (RAND() * 50), 0);
    SET peso = ROUND(60 + (RAND() * 40), 2);
    SET imc = ROUND(peso / ((1.70) * (1.70)), 2); -- asumiendo altura 1.70m prom.
    
    SET m_dia = ELT(FLOOR(1 + (RAND() * 3)), 'Mañana', 'Tarde', 'Noche');
    SET ayunas = IF(RAND() > 0.5, 1, 0);
    SET p_heridas = IF(RAND() > 0.9, 1, 0);
    SET p_ampollas = IF(RAND() > 0.8, 1, 0);
    SET p_rojeces = IF(RAND() > 0.7, 1, 0);
    SET p_color = IF(RAND() > 0.8, 1, 0);

    INSERT INTO MEDICION_CLINICA (id_paciente, id_medico, fecha_hora, glucosa_mg_dl, presion_sistolica, presion_diastolica, peso_kg, imc, momento_dia, en_ayunas, pie_heridas, pie_ampollas, pie_rojeces, pie_coloracion, notes)
    VALUES (p_id, m_id, f_date, glucosa, p_sist, p_diast, peso, imc, m_dia, ayunas, p_heridas, p_ampollas, p_rojeces, p_color, 'Generado automáticamente');
    
    -- Insert random symptoms for this measurement (1 to 2 symptoms, up to 9 symptoms total)
    INSERT INTO MEDICION_SINTOMA (id_medicion, id_sintoma)
    VALUES (LAST_INSERT_ID(), FLOOR(1 + (RAND() * 9)));
    
    IF RAND() > 0.5 THEN
      INSERT IGNORE INTO MEDICION_SINTOMA (id_medicion, id_sintoma)
      VALUES (LAST_INSERT_ID(), FLOOR(1 + (RAND() * 9)));
    END IF;
    
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;

CALL SeedMediciones();
DROP PROCEDURE SeedMediciones;
