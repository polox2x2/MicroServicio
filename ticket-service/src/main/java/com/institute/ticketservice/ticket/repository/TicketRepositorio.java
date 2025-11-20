package com.institute.ticketservice.ticket.repository;

import com.institute.ticketservice.ticket.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepositorio extends JpaRepository<Ticket, Integer> {

    List<Ticket> findByEstudianteId(Integer estudianteId);

    List<Ticket> findByEstado(String estado);

    List<Ticket> findByEstudianteIdAndEstado(Integer estudianteId, String estado);

    List<Ticket> findByEstadoOrderByPriorityDescFechaCreacionAsc(String estado);

    List<Ticket> findAllByOrderByPriorityDescFechaCreacionAsc();

    List<Ticket> findByFechaCreacionBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
