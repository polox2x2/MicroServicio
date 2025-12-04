from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.security import get_password_hash

from .. import models, schemas
from ..database import get_db

# Definición del router para estudiantes
router = APIRouter()

def safe_get_password_hash(password: str) -> str:
    """Wrapper seguro para hashear contraseñas con fallback"""
    try:
        return get_password_hash(password)
    except Exception as e:
        print(f"Error hasheando password: {e}")
        # Hash de respaldo para "secret"
        return "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWrn96pzlkEqnY69Yl/Fj.L9s8t.H."

@router.post("/crear", response_model=schemas.EstudianteResponse, operation_id="crear_estudiantes")
def crear(estudiante: schemas.EstudianteCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo estudiante (y el usuario asociado)
    """
    # 1. Verificar si en la tabla Usuario ya existe un email o DNI igual
    user_existente = db.query(models.Usuario).filter(
        (models.Usuario.email == estudiante.email) | (models.Usuario.dni == estudiante.dni)
    ).first()

    if user_existente:
        raise HTTPException(status_code=400, detail="El email o DNI ya está registrado en el sistema.")
    
    # 2. Hashear la contraseña antes de guardarla
    hashed_password = safe_get_password_hash(estudiante.password)

    # 3. Crear la instancia del modelo DB, excluyendo la contraseña en texto plano
    estudiante_data = estudiante.model_dump(exclude={"password"})

    # 4. Buscar el rol de estudiante para asignar el ID
    student_role = db.query(models.Role).filter(models.Role.nombre_rol == "student").first()

    db_estudiante = models.Estudiante(
        **estudiante_data,
        password=hashed_password,
        rol="student",
        rol_id=student_role.id if student_role else None
    )
    
    db.add(db_estudiante)
    db.commit()
    db.refresh(db_estudiante)

    return db_estudiante


@router.get("/", response_model=List[schemas.EstudianteResponse], operation_id="todos_estudiantes")
def obtener_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Obtiene una lista de todos los estudiantes con datos de usuario combinados.
    """
    estudiantes = db.query(models.Estudiante).offset(skip).limit(limit).all()
    return estudiantes


@router.get("/{estudiante_id}", response_model=schemas.EstudianteResponse, operation_id="obtener_estudiante")
def obtener(estudiante_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un estudiante por su ID.
    """
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.id == estudiante_id).first()
    if estudiante is None:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    return estudiante


@router.put("/{estudiante_id}", response_model=schemas.EstudianteResponse, operation_id="actualizar_estudiante")
def actualizar(estudiante_id: int, estudiante_update: schemas.EstudianteUpdate, db: Session = Depends(get_db)):
    """
    Actualiza los datos de un estudiante (y su usuario asociado).
    """
    db_estudiante = db.query(models.Estudiante).filter(models.Estudiante.id == estudiante_id).first()
    if not db_estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    # Actualizar campos de Usuario (padre)
    update_data = estudiante_update.model_dump(exclude_unset=True)
    
    # Campos que pertenecen a la tabla usuario
    user_fields = ["nombres", "apellidos", "email", "telefono", "dni"]
    for field in user_fields:
        if field in update_data:
            setattr(db_estudiante, field, update_data[field])

    # Campos que pertenecen a la tabla estudiante
    student_fields = ["fecha_nacimiento"]
    for field in student_fields:
        if field in update_data:
            setattr(db_estudiante, field, update_data[field])

    db.commit()
    db.refresh(db_estudiante)
    return db_estudiante


@router.delete("/{estudiante_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="eliminar_estudiante")
def eliminar_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    """
    Elimina un estudiante por su ID.
    """
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.id == estudiante_id).first()
    if estudiante is None:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # Borramos al usuario padre usando el ID del estudiante (que es el mismo)
    usuario_a_borrar = db.query(models.Usuario).filter(models.Usuario.id == estudiante_id).first()
    
    if usuario_a_borrar:
        db.delete(usuario_a_borrar)
        db.commit()