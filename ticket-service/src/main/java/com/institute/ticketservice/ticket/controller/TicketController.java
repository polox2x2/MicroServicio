package com.institute.ticketservice.ticket.controller;

import com.institute.ticketservice.ticket.dto.TicketCreateRequestDTO;
import com.institute.ticketservice.ticket.dto.TicketUpdateStatusRequestDTO;
import com.institute.ticketservice.ticket.model.Ticket;
import com.institute.ticketservice.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketServicio;

    @PostMapping
    public ResponseEntity<Ticket> crear(@Valid @RequestBody TicketCreateRequestDTO dto) {
        Ticket guardado = ticketServicio.crearTicket(dto);
        return ResponseEntity.ok(guardado);
    }

    @GetMapping
    public List<Ticket> listar(
            @RequestParam(required = false) Integer estudianteId,
            @RequestParam(required = false) String estado) {
        return ticketServicio.listarTickets(estudianteId, estado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> obtenerPorId(@PathVariable Integer id) {
        Ticket ticket = ticketServicio.obtenerPorId(id);
        return ResponseEntity.ok(ticket);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Ticket> actualizarEstado(
            @PathVariable Integer id,
            @Valid @RequestBody TicketUpdateStatusRequestDTO dto) {
        Ticket actualizado = ticketServicio.actualizarEstado(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> asignarTicket(
            @PathVariable Integer id,
            @RequestParam Integer advisorId) {
        Ticket asignado = ticketServicio.asignarTicket(id, advisorId);
        return ResponseEntity.ok(asignado);
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<com.institute.ticketservice.ticket.model.TicketInteraction> agregarInteraccion(
            @PathVariable Integer id,
            @Valid @RequestBody com.institute.ticketservice.ticket.dto.TicketInteractionCreateRequestDTO dto) {
        com.institute.ticketservice.ticket.model.TicketInteraction interaction = ticketServicio.agregarInteraccion(id,
                dto);
        return ResponseEntity.ok(interaction);
    }

    @GetMapping("/{id}/interactions")
    public ResponseEntity<List<com.institute.ticketservice.ticket.model.TicketInteraction>> obtenerInteracciones(
            @PathVariable Integer id) {
        List<com.institute.ticketservice.ticket.model.TicketInteraction> interacciones = ticketServicio
                .obtenerInteracciones(id);
        return ResponseEntity.ok(interacciones);
    }

    @GetMapping("/report-data")
    public ResponseEntity<List<Ticket>> obtenerDatosReporte(
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(ticketServicio.obtenerTicketsPorRango(start, end));
    }

}
