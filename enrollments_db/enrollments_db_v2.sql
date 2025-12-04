CREATE DATABASE IF NOT EXISTS enrollments_db;
USE enrollments_db;

-- Tabla de inscripciones
CREATE TABLE enrollment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    
    UNIQUE KEY uk_student_course (student_id, course_id)
);

-- Índices
CREATE INDEX idx_enrollment_student ON enrollment(student_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);
