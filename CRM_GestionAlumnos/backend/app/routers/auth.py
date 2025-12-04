from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..core import security
from ..config import settings

router = APIRouter()

@router.post("/login", response_model=schemas.Token, operation_id="login_access_token")
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # 1. Buscar al usuario por su email
    user = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()

    # 2. Verificar si el usuario existe y si la contraseña es correcta
    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Definir el tiempo de expiración del token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # 4. Crear el token JWT con email, user_id y role
    access_token = security.create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.rol,
            "scope": user.rol
        },
        expires_delta=access_token_expires
    )

    # 5. Devolver el token
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.rol
    }