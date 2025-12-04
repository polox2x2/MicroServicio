from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime, date

#------------------------------
# Esquemas para Roles
#------------------------------
class RoleBase(BaseModel):
    nombre_rol: str
    descripcion: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

#------------------------------

#------------------------------
# Esquemas para base de Usuario
#------------------------------
# Datos compartidos por Estudiante, Profesor y Admin
class UsuarioBase(BaseModel):
    nombres: str
    apellidos: Optional[str] = None
    email: EmailStr
    telefono: Optional[str] = Field(None, max_length=20, description="El número telefónico")
    dni: int = Field(..., ge=10000000, le=99999999, description="El DNI debe tener 8 dígitos")
    # rol: str - ahora se maneja en modelos con CheckConstraint

class UsuarioCreate(UsuarioBase):
    password: Optional[str] = None
    # rol se asigna automáticamente en el backend según el tipo de usuario

class UsuarioResponse(UsuarioBase):
    id: int
    creado_el: Optional[datetime] = None
    rol: str
    # omitir password en la respuesta por seguridad

    model_config = ConfigDict(from_attributes=True)


#------------------------------
# Esquema para Estudiante
#------------------------------

#Lo que recibes al crear un estudiante (Input)
class EstudianteCreate(UsuarioBase):
    password: str
    fecha_nacimiento: Optional[date] = None
    # rol se asigna automáticamente como 'student' en el backend

# Lo que devuelves al leer un estudiante (Output)
class EstudianteResponse(UsuarioBase):
    id: int
    fecha_nacimiento: Optional[date] = None
    creado_el: Optional[datetime] = None
    rol: str
    # omitir password en la respuesta por seguridad

    model_config = ConfigDict(from_attributes=True)

class EstudianteUpdate(BaseModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    dni: Optional[int] = None
    fecha_nacimiento: Optional[date] = None

#------------------------------
# Esquema para Profesor
#------------------------------
class ProfesorCreate(UsuarioBase):
    password: str
    especialidad: Optional[str] = None
    fecha_contratacion: Optional[date] = None
    # rol se asigna automáticamente como 'teacher' en el backend

class ProfesorResponse(UsuarioBase):
    id: int
    especialidad: Optional[str] = None
    fecha_contratacion: Optional[date] = None
    creado_el: Optional[datetime] = None
    rol: str
    # omitir password en la respuesta por seguridad

    model_config = ConfigDict(from_attributes=True)

#---------------------------------
# Esquema para autenticación (JWT)
#---------------------------------

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str

# Este schema se usa cuando el frontend envía las credenciales
# Aunque FastAPI usa uno interno (OAuth2PasswordRequestForm), es bueno tenerlo mapeado.
class Login(BaseModel):
    username: str # En nuestro caso será el email
    password: str

#Esta parte se omite porque no se va a trabajar, versión antigua
'''
# Esquema base para Calificacion
class CalificacionBase(BaseModel):
    puntaje: float

class CalificacionCrear(CalificacionBase):
    pass

class Calificacion(CalificacionBase):
    id: int
    estudiante_id: int
    curso_id: int
    creado_el: datetime

    class Config:
        from_attributes = True
'''