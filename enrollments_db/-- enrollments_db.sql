-- enrollments_db
CREATE DATABASE enrollments_db;
USE enrollments_db;

CREATE TABLE enrollment (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL, -- Referencia lógica a users_db.user.id
  course_id INT NOT NULL,  -- Referencia lógica a courses_db.course.id
  enrolled_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed'))
);

CREATE UNIQUE INDEX idx_enrollment_unique ON enrollment(student_id, course_id);
CREATE INDEX idx_enrollment_student ON enrollment(student_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);