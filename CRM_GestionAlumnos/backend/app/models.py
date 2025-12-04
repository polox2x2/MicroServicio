from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, CheckConstraint, Date, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


#Se corrigieron las tablas para implementar herencia con una tabla base Usuario

class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(50), unique=True, nullable=False)
    descripcion = Column(String(255), nullable=True)

    def __repr__(self):
        return f"<Role(nombre_rol={self.nombre_rol})>"


class Usuario(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    telefono = Column(String(20))
    dni = Column(Integer, unique=True, index=True)
    password = Column(String(255), nullable=True)
    # ROL del usuario: 'student', 'teacher', 'admin'
    rol = Column(String(20), nullable=False)
    # Foreign Keys y Timestamps
    rol_id = Column(Integer, ForeignKey("role.id"))
    creado_el = Column(DateTime(timezone=True), server_default=func.now())

    role = relationship("Role", backref="users", foreign_keys=[rol_id])

    __table_args__ = (
        CheckConstraint(rol.in_(["student", "professor", "admin", "user"]), name="check_user_role"),
        Index("idx_user_email", "email"),
        Index("idx_user_role", "rol"),
    )

    __mapper_args__ = {
        "polymorphic_identity": "usuario",
        "polymorphic_on": rol,
    }


class Estudiante(Usuario):
    __tablename__ = "student"

    # Tabla específica para Estudiante
    id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    fecha_nacimiento = Column(Date, nullable=True)

    __mapper_args__ = {
        "polymorphic_identity": "student",
    }


class Profesor(Usuario):
    __tablename__ = "professor"

    id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"),primary_key=True, index=True)
    especialidad = Column(String(100))
    fecha_contratacion = Column(Date)
    
    __mapper_args__ = {
        "polymorphic_identity": "professor",
    }

    # Relación: Un profesor puede asignar muchas calificaciones
    # calificaciones = relationship("Calificacion", back_populates="profesor")
    # cursos = relationship("Curso", back_populates="profesor") 

class Admin(Usuario):
    __tablename__ = "admin"

    id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "admin",
    } 

# class Curso(Base):
#     __tablename__ = "cursos"
#
#     id = Column(Integer, primary_key=True, index=True)
#     codigo = Column(String, unique=True, index=True)
#     nombre_curso = Column(String, nullable=False)
#     profesor_id = Column(Integer, ForeignKey("profesor.id"))
#     profesor = relationship("Profesor", back_populates="cursos")
#     calificaciones = relationship("Calificacion", back_populates="curso")

# class Calificacion(Base):
#     __tablename__ = "calificaciones"
#
#     id = Column(Integer, primary_key=True, index=True)
#     puntaje = Column(Float, nullable=False)
#     creado_el = Column(DateTime(timezone=True), server_default=func.now())
#     estudiante_id = Column(Integer, ForeignKey("estudiante.id"))
#     profesor_id = Column(Integer, ForeignKey("profesor.id"))
#     curso_id = Column(Integer, ForeignKey("cursos.id"))
#
#     # Relaciones
#     estudiante = relationship("Estudiante", back_populates="calificaciones")
#     profesor = relationship("Profesor", back_populates="calificaciones")
#     curso = relationship("Curso", back_populates="calificaciones")
#
#     __table_args__ = (UniqueConstraint('estudiante_id', 'curso_id', name='_estudiante_curso_uc'),)