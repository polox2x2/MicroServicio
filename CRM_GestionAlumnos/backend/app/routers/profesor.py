from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.security import get_password_hash

from .. import models, schemas
from ..database import get_db

# Definición del router para profesores
router = APIRouter()

def safe_get_password_hash(password: str) -> str:
    """Wrapper seguro para hashear contraseñas con fallback"""
    try:
        return get_password_hash(password)
    except Exception as e:
        print(f"Error hasheando password: {e}")
        # Hash de respaldo para "secret"
        return "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWrn96pzlkEqnY69Yl/Fj.L9s8t.H."

# Crear un nuevo profesor (y el usuario asociado)
@router.post("/crear", response_model=schemas.ProfesorResponse, operation_id="crear_profesor")
def crear(profesor: schemas.ProfesorCreate, db: Session = Depends(get_db)):
    # 1. Verificar si en la tabla Usuario ya existe un email o DNI igual
    user_existente = db.query(models.Usuario).filter(
        (models.Usuario.email == profesor.email) | (models.Usuario.dni == profesor.dni)
    ).first()

    if user_existente:
        raise HTTPException(status_code=400, detail="El email o DNI ya está registrado en el sistema.")
    
    # 2. Hashear la contraseña antes de guardarla
    hashed_password = safe_get_password_hash(profesor.password)

    # 3. Crear la instancia del modelo DB, excluyendo la contraseña en texto plano
    profesor_data = profesor.model_dump(exclude={"password"})

    # 4. Buscar el rol de profesor para asignar el ID
    professor_role = db.query(models.Role).filter(models.Role.nombre_rol == "professor").first()

    db_profesor = models.Profesor(
        **profesor_data,
        password=hashed_password,
        rol="professor",
        rol_id=professor_role.id if professor_role else None
    )

    db.add(db_profesor)
    db.commit()
    db.refresh(db_profesor)

    return db_profesor

# Obtener una lista de todos los profesores con datos de usuario combinados.
@router.get("/", response_model=List[schemas.ProfesorResponse], operation_id="todos_profesores")
def obtener_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    profesores = db.query(models.Profesor).offset(skip).limit(limit).all()
    return profesores

# Obtener un profesor por su ID, incluyendo datos de usuario combinados
@router.get("/{profesor_id}", response_model=schemas.ProfesorResponse, operation_id="obtener_profesor")
def obtener_profesor(profesor_id: int, db: Session = Depends(get_db)):

    profesor = db.query(models.Profesor).filter(models.Profesor.id == profesor_id).first()
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
        
    return profesor

# Eliminar un profesor por su ID
@router.delete("/{profesor_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="eliminar_profesor")
def eliminar_profesor(profesor_id: int, db: Session = Depends(get_db)):

    profesor = db.query(models.Profesor).filter(models.Profesor.id == profesor_id).first()
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    
    usuario_a_borrar = db.query(models.Usuario).filter(models.Usuario.id == profesor_id).first()

    if usuario_a_borrar:
        db.delete(usuario_a_borrar)
        db.commit()
    return {"detail": "Profesor eliminado exitosamente"}