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

DROP DATABASE grades_Db