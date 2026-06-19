SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS control_medico;
USE control_medico;

CREATE TABLE MEDICO (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  especialidad VARCHAR(80) NOT NULL
);

CREATE TABLE PACIENTE (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  rut VARCHAR(20) UNIQUE,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero ENUM('M', 'F'),
  telefono VARCHAR(20),
  email VARCHAR(150) UNIQUE,
  contrasena VARCHAR(255) NOT NULL DEFAULT '1234',
  id_medico INT,
  FOREIGN KEY (id_medico) REFERENCES MEDICO(id),
  fecha_registro DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE SINTOMA (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  sigla VARCHAR(20) NOT NULL UNIQUE,
  categoria VARCHAR(50) NOT NULL
);

CREATE TABLE ENFERMEDAD (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  sigla VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE IDIOMA (
  id CHAR(5) PRIMARY KEY,
  nombre_idioma VARCHAR(50) NOT NULL,
  codigo_locale VARCHAR(20) NOT NULL
);

CREATE TABLE ENFERMEDAD_TRADUCCION (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_enfermedad INT NOT NULL,
  id_idioma CHAR(5) NOT NULL,
  FOREIGN KEY (id_enfermedad) REFERENCES ENFERMEDAD(id),
  FOREIGN KEY (id_idioma) REFERENCES IDIOMA(id),
  nombre_enfermedad VARCHAR(150) NOT NULL,
  descripcion TEXT
);

CREATE TABLE PACIENTE_ENFERMEDAD (
  id_paciente INT NOT NULL,
  id_enfermedad INT NOT NULL,
  FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id),
  FOREIGN KEY(id_enfermedad) REFERENCES ENFERMEDAD(id),
  fecha_diagnostico DATE NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo'
);

CREATE TABLE SINTOMA_TRADUCCION (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_sintoma INT NOT NULL,
  id_idioma CHAR(5) NOT NULL,
  FOREIGN KEY (id_sintoma) REFERENCES SINTOMA(id),
  FOREIGN KEY (id_idioma) REFERENCES IDIOMA(id),
  nombre_sintoma VARCHAR(150) NOT NULL,
  descripcion TEXT
);

CREATE TABLE MEDICION_CLINICA (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_paciente INT NOT NULL,
  id_medico INT NOT NULL,
  FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id),
  FOREIGN KEY (id_medico) REFERENCES MEDICO(id),
  fecha_hora DATETIME NOT NULL DEFAULT NOW(),
  glucosa_mg_dl DECIMAL(6,2),
  presion_sistolica SMALLINT UNSIGNED,
  presion_diastolica SMALLINT UNSIGNED,
  peso_kg DECIMAL(5,2),
  imc DECIMAL(4,2),
  momento_dia ENUM('Mañana', 'Tarde', 'Noche'),
  en_ayunas BOOLEAN,
  pie_heridas BOOLEAN,
  pie_ampollas BOOLEAN,
  pie_rojeces BOOLEAN,
  pie_coloracion BOOLEAN,
  notes VARCHAR(500),
  INDEX idx_paciente_fecha (id_paciente, fecha_hora)
);

CREATE TABLE MEDICION_SINTOMA(
  id_medicion INT NOT NULL,
  id_sintoma INT NOT NULL,
  FOREIGN KEY (id_medicion) REFERENCES MEDICION_CLINICA(id),
  FOREIGN KEY (id_sintoma) REFERENCES SINTOMA(id)
);

CREATE TABLE ALERTA (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  id_medicion INT NOT NULL,
  id_medico INT NOT NULL,
  FOREIGN KEY (id_medicion) REFERENCES MEDICION_CLINICA(id),
  FOREIGN KEY (id_medico) REFERENCES MEDICO(id),
  tipo_alerta VARCHAR(50) NOT NULL,
  nivel_severidad VARCHAR(20),
  fecha_alarma DATETIME DEFAULT NOW(),
  estado VARCHAR(20) DEFAULT 'pendiente', 
  mensaje TEXT NOT NULL
);
