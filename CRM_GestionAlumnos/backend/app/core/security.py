from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt, JWTError
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# Argon2 password hasher (modern and secure)
ph = PasswordHasher()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Función para crear el hash de la contraseña usando Argon2
def get_password_hash(password: str) -> str:
    """Hash password using Argon2"""
    try:
        return ph.hash(password)
    except Exception as e:
        print(f"Error hashing password: {e}")
        raise

# Función para verificar contraseña usando Argon2
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using Argon2"""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except VerifyMismatchError:
        return False
    except InvalidHash:
        print(f"Invalid hash format")
        return False
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False

# Función para crear el Token JWT
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    from ..config import settings
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Función para obtener el usuario actual desde el token
def get_current_user(token: str = Depends(oauth2_scheme)):
    """Dependency to get current authenticated user from JWT token"""
    from ..config import settings
    from ..database import SessionLocal
    from .. import models
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Create a new database session
    db = SessionLocal()
    try:
        user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
        if user is None:
            raise credentials_exception
        # Refresh to ensure we have the latest data
        db.refresh(user)
        # Detach user from session so it can be used outside
        db.expunge(user)
        return user
    except Exception as e:
        print(f"Error getting current user: {e}")
        raise credentials_exception
    finally:
        db.close()