from typing import Union
from fastapi import FastAPI, Request
from .database import engine, SessionLocal
from .init_db import init_db
from . import models
from .routers import estudiante, usuario, profesor, roles, auth, ticket  # Importa tu nuevo router

models.Base.metadata.create_all(bind=engine)

# Inicializar datos (Roles y Admin)
db = SessionLocal()
try:
    init_db(db)
finally:
    db.close()

app = FastAPI(title="CRM Gestión de Alumnos API")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    return response

# Todas las rutas estarán aquí:
# Router de Usuarios (General / Administradores)
app.include_router(
    usuario.router,
    prefix="/usuarios",
    tags=["Usuarios"]
)
# Router para Estudiantes
app.include_router(
    estudiante.router,
    prefix="/estudiantes",
    tags=["Estudiantes"]
)

# Router para Profesores
app.include_router(
    profesor.router,
    prefix="/profesores",
    tags=["Profesores"]
)

# Router para Roles
app.include_router(
    roles.router,
    prefix="/roles",
    tags=["Roles"]
)

# Router para Tickets
app.include_router(
    ticket.router,
    prefix="/tickets",
    tags=["Tickets"]
)

# Router para Autenticación
# IMPORTANTE: El router de auth no suele llevar prefijo, o usa /api/v1
app.include_router(
    auth.router,
    tags=["Login"]
)

@app.get("/")
async def root():
    return {"message":"¡Bienvenido a la API del CRM!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
