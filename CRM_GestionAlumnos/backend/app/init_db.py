from sqlalchemy.orm import Session
from . import models, schemas

def safe_get_password_hash(password: str) -> str:
    """Hash password using Argon2"""
    from .core.security import get_password_hash
    return get_password_hash(password)

def init_db(db: Session):
    # 1. Crear Roles por defecto
    roles_to_create = [
        {"nombre_rol": "admin", "descripcion": "Administrador del sistema"},
        {"nombre_rol": "professor", "descripcion": "Profesor"},
        {"nombre_rol": "student", "descripcion": "Estudiante"},
    ]

    for role_data in roles_to_create:
        role = db.query(models.Role).filter(models.Role.nombre_rol == role_data["nombre_rol"]).first()
        if not role:
            new_role = models.Role(**role_data)
            db.add(new_role)
            print(f"Rol creado: {role_data['nombre_rol']}")
    
    db.commit()

    # 2. Crear Usuario Admin por defecto
    admin_email = "admin@crm.com"
    admin_user = db.query(models.Usuario).filter(models.Usuario.email == admin_email).first()
    hashed_password = safe_get_password_hash("admin123")
    admin_role = db.query(models.Role).filter(models.Role.nombre_rol == "admin").first()
    
    if not admin_user:
        new_admin = models.Admin(
            nombres="Admin",
            apellidos="System",
            email=admin_email,
            dni=99999999,
            password=hashed_password,
            rol="admin",
            rol_id=admin_role.id if admin_role else None
        )
        db.add(new_admin)
        print(f"Usuario Admin creado: {admin_email} / admin123")
    else:
        # Update password to ensure it uses the new hash format
        admin_user.password = hashed_password
        print(f"Usuario Admin actualizado con nuevo hash: {admin_email}")
    
    db.commit()

    # 3. Crear Profesor por defecto
    profesor_email = "profesor@crm.com"
    profesor_user = db.query(models.Usuario).filter(models.Usuario.email == profesor_email).first()
    hashed_password = safe_get_password_hash("profesor123")
    profesor_role = db.query(models.Role).filter(models.Role.nombre_rol == "professor").first()
    
    if not profesor_user:
        new_profesor = models.Profesor(
            nombres="Juan",
            apellidos="Perez",
            email=profesor_email,
            dni=11111111,
            password=hashed_password,
            rol="professor",
            rol_id=profesor_role.id if profesor_role else None,
            especialidad="Matemáticas",
            fecha_contratacion="2023-01-01"
        )
        db.add(new_profesor)
        print(f"Usuario Profesor creado: {profesor_email} / profesor123")
    else:
        # Update password to ensure it uses the new hash format
        profesor_user.password = hashed_password
        print(f"Usuario Profesor actualizado con nuevo hash: {profesor_email}")
        
    db.commit()

    # 4. Crear Estudiante por defecto
    estudiante_email = "estudiante@crm.com"
    estudiante_user = db.query(models.Usuario).filter(models.Usuario.email == estudiante_email).first()
    hashed_password = safe_get_password_hash("estudiante123")
    estudiante_role = db.query(models.Role).filter(models.Role.nombre_rol == "student").first()
    
    if not estudiante_user:
        new_estudiante = models.Estudiante(
            nombres="Maria",
            apellidos="Gomez",
            email=estudiante_email,
            dni=22222222,
            password=hashed_password,
            rol="student",
            rol_id=estudiante_role.id if estudiante_role else None,
            fecha_nacimiento="2005-05-15"
        )
        db.add(new_estudiante)
        print(f"Usuario Estudiante creado: {estudiante_email} / estudiante123")
    else:
        # Update password to ensure it uses the new hash format
        estudiante_user.password = hashed_password
        print(f"Usuario Estudiante actualizado con nuevo hash: {estudiante_email}")
        
    db.commit()
