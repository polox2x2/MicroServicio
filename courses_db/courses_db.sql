CREATE DATABASE IF NOT EXISTS courses_db;
USE courses_db;

-- Tabla de cursos
CREATE TABLE course (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    credits INT DEFAULT 3,
    semester VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de asignaciones
CREATE TABLE teacher_assignment (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES course(id)
        ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_course_code ON course(code);
CREATE INDEX idx_course_semester ON course(semester);
CREATE INDEX idx_teacher_assignment_teacher 
    ON teacher_assignment(teacher_id);
CREATE INDEX idx_teacher_assignment_course 
    ON teacher_assignment(course_id);
