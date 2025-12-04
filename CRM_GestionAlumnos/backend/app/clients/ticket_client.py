import httpx
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class TicketClient:
    def __init__(self, base_url: str = "http://ticket-service:8094"):
        self.base_url = base_url
        self.timeout = 10.0
    
    async def create_ticket(
        self,
        title: str,
        description: str,
        student_id: int,
        priority: str = "MEDIUM",
        token: str = None
    ) -> Optional[dict]:
        """
        Create a ticket in the Ticket Service
        """
        try:
            url = f"{self.base_url}/api/tickets"
            payload = {
                "titulo": title,
                "descripcion": description,
                "estudianteId": student_id,
                "canalId": 1, # Default channel ID, assuming 1 exists or is valid
                "priority": priority,
                "status": "OPEN"
            }
            
            headers = {}
            if token:
                headers["Authorization"] = f"Bearer {token}"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                
                logger.info(f"Ticket created successfully for student {student_id}")
                return response.json()
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to create ticket: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error creating ticket: {e}")
            return None
    
    async def get_student_tickets(self, student_id: int) -> Optional[list]:
        """
        Get all tickets for a student
        """
        try:
            url = f"{self.base_url}/api/tickets/student/{student_id}"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                logger.info(f"Retrieved tickets for student {student_id}")
                return response.json()
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to get tickets: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error getting tickets: {e}")
            return None
