package com.institute.ticketservice.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketCreateRequestDTO {

    @NotNull
    private Integer estudianteId;

    @NotBlank
    private String titulo;

    @NotBlank
    private String descripcion;

    @NotNull
    private Integer canalId;

    private String priority;
}
