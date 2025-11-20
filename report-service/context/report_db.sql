CREATE DATABASE IF NOT EXISTS reports_db;
USE reports_db;

-- Tabla reports_db.report
CREATE TABLE report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'academic', 'attendance', 'support'
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_report_type ON report(type);
1
-- Tabla reports_db.metric
CREATE TABLE metric (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- Ej: 'avg_grade', 'open_tickets'
    value NUMERIC(10,2) NOT NULL,
    -- Definición de clave foránea
    CONSTRAINT fk_metric_report
        FOREIGN KEY (report_id)
        REFERENCES report(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_metric_report ON metric(report_id);

--BASE DE DATOS GRADES YA FUE CREADA
-- Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS grades_db;
USE grades_db;
-- Tabla evaluation
CREATE TABLE evaluation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL, -- Referencia lógica a courses_db.course.id
    name VARCHAR(100) NOT NULL, -- Ej: "Examen Parcial", "Tarea 1"
    max_score DECIMAL(5,2) DEFAULT 20.00,
    weight DECIMAL(3,2) DEFAULT 1.00, -- Porcentaje o peso (0.00 a 1.00)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Nota: En MySQL, SERIAL es un alias para BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE

-- Tabla grade
CREATE TABLE grade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id INT NOT NULL,
    student_id INT NOT NULL, -- Referencia lógica a users_db.user.id
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Definición de clave foránea
    CONSTRAINT fk_grade_evaluation
        FOREIGN KEY (evaluation_id)
        REFERENCES evaluation(id)
        ON DELETE CASCADE
);

-- Índices y Restricciones
CREATE UNIQUE INDEX idx_grade_unique ON grade(evaluation_id, student_id);
CREATE INDEX idx_grade_student ON grade(student_id); -- Para búsquedas por estudiante (users_db.user.id)
CREATE INDEX idx_grade_evaluation ON grade(evaluation_id);

DROP DATABASE grades_Db;
SELECT * FROM grade;
SELECT * FROM evaluation;