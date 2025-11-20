package com.institute.ticketservice.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketInteractionCreateRequestDTO {

    @NotNull
    private Integer authorId;

    @NotBlank
    private String content;

    @NotBlank
    private String type; // NOTE or REPLY
}
