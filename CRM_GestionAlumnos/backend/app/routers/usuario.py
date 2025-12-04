from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.security import get_password_hash # importa get_password_hash desde el módulo de seguridad centralizado

from .. import models, schemas
from ..database import get_db

router = APIRouter()

def get_password_hash(password):
    return pwd_context.hash(password)

@router.get("/", response_model=List[schemas.UsuarioResponse], operation_id="todos_usuarios")
def obtener_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Obtiene una lista de todos los usuarios.
    """
    usuarios = db.query(models.Usuario).offset(skip).limit(limit).all()
    return usuarios

# Crear un usuario con rol de ADMINISTRADOR
@router.post("/crear-admin", response_model=schemas.UsuarioResponse, operation_id="crear_admin")
def crear_admin(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo usuario genérico.
    """
    # Verificar si ya existe un email o DNI igual
    user_existente = db.query(models.Usuario).filter(
        (models.Usuario.email == usuario.email) | (models.Usuario.dni == usuario.dni)
    ).first()

    if user_existente:
        raise HTTPException(status_code=400, detail="El email o DNI ya está registrado en el sistema.")
    
    # Hashear la contraseña antes de guardarla
    hashed_password = get_password_hash(usuario.password)

    # Crear la instancia del modelo DB, excluyendo la contraseña en texto plano
    usuario_data = usuario.model_dump(exclude={"password"})

    db_usuario = models.Usuario(
        **usuario_data,
        password=hashed_password,
        rol="admin"
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)

    return db_usuario

# Crear un usuario con rol de USUARIO GENÉRICO
@router.post("/crear-usuario", response_model=schemas.UsuarioResponse, operation_id="crear_usuario")
def crear_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo usuario genérico.
    """
    # Verificar si ya existe un email o DNI igual
    user_existente = db.query(models.Usuario).filter(
        (models.Usuario.email == usuario.email) | (models.Usuario.dni == usuario.dni)
    ).first()

    if user_existente:
        raise HTTPException(status_code=400, detail="El email o DNI ya está registrado en el sistema.")

    # Crear la instancia del modelo DB, excluyendo la contraseña en texto plano
    usuario_data = usuario.model_dump(exclude={"password"})

    db_usuario = models.Usuario(
        **usuario_data,
        password = None,
        rol = "user"
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)

    return db_usuario

@router.get("/{usuario_id}", response_model=schemas.UsuarioResponse, operation_id="obtener_usuario")
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """
    Obtiene un usuario por su ID.
    """
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT, operation_id="eliminar_usuario")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """
    Elimina un usuario por su ID.
    """
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(usuario)
    db.commit()
    return