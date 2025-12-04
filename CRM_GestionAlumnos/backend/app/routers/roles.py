from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter()

# 1. GET: Listar todos los roles (Para llenar selects en el Frontend)
@router.get("/", response_model=List[schemas.Role], operation_id="obtener_roles")
def obtener_roles(db: Session = Depends(get_db)):
    """
    Retorna la lista de roles disponibles en el sistema.
    """
    roles = db.query(models.Role).all()
    return roles

# 2. POST: Crear un rol (Útil para configuración inicial)
@router.post("/", response_model=schemas.Role, operation_id="crear_rol")
def crear_rol(rol: schemas.RoleCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo rol en la base de datos.
    """
    # Verificar si el rol ya existe
    rol_existente = db.query(models.Role).filter(models.Role.nombre_rol == rol.nombre_rol).first()
    if rol_existente:
        raise HTTPException(status_code=400, detail="El rol ya existe")

    db_rol = models.Role(
        nombre_rol=rol.nombre_rol,
        descripcion=rol.descripcion
    )
    
    db.add(db_rol)
    db.commit()
    db.refresh(db_rol)
    
    return db_rol