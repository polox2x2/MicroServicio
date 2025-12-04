from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..clients.ticket_client import TicketClient
from .. import models

router = APIRouter()
ticket_client = TicketClient()

class TicketCreateRequest(BaseModel):
    title: str
    description: str
    priority: str = "MEDIUM"

class TicketResponse(BaseModel):
    message: str
    ticket: Optional[dict] = None

from ..core.security import get_current_user

@router.post("/crear", response_model=TicketResponse)
async def crear_ticket(
    request: TicketCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    """
    Create a ticket for the authenticated student
    """
    # Verify user role
    if current_user.rol != "student":
        raise HTTPException(
            status_code=403,
            detail="Solo los estudiantes pueden crear tickets"
        )
    
    # Create ticket using authenticated user's ID
    # We need to regenerate a token for the inter-service communication or forward the existing one
    # For simplicity, we'll create a new token for the user to pass to the ticket service
    from ..core.security import create_access_token
    from datetime import timedelta
    
    # Create a short-lived token for the request
    access_token = create_access_token(
        data={"sub": current_user.email, "user_id": current_user.id, "role": current_user.rol},
        expires_delta=timedelta(minutes=5)
    )

    ticket = await ticket_client.create_ticket(
        title=request.title,
        description=request.description,
        student_id=current_user.id,
        priority=request.priority,
        token=access_token
    )
    
    if not ticket:
        raise HTTPException(
            status_code=500,
            detail="Error al crear ticket en el servicio de tickets"
        )
    
    return TicketResponse(
        message="Ticket creado exitosamente (sin autenticación aún)",
        ticket=ticket
    )

@router.get("/estudiante/{student_id}")
async def obtener_tickets_estudiante(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all tickets for a student
    """
    student = db.query(models.Estudiante).filter(
        models.Estudiante.id == student_id
    ).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    tickets = await ticket_client.get_student_tickets(student_id)
    
    if tickets is None:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener tickets del servicio de tickets"
        )
    
    return {
        "student_id": student_id,
        "student_name": f"{student.nombres} {student.apellidos}",
        "tickets": tickets
    }
