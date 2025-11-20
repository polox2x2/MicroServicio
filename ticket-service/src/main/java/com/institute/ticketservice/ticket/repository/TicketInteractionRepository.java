package com.institute.ticketservice.ticket.repository;

import com.institute.ticketservice.ticket.model.TicketInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketInteractionRepository extends JpaRepository<TicketInteraction, Integer> {
    List<TicketInteraction> findByTicketIdOrderByTimestampAsc(Integer ticketId);
}
