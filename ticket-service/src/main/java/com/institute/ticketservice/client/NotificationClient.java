package com.institute.ticketservice.client;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@Slf4j
public class NotificationClient {

    private final RestTemplate restTemplate;

    @Value("${notification.service.url:http://notification-service:8095}")
    private String notificationServiceUrl;

    public NotificationClient() {
        this.restTemplate = new RestTemplate();
    }

    public void sendTicketCreatedNotification(Integer ticketId, String title, Integer studentId) {
        try {
            String url = notificationServiceUrl + "/api/notifications/send";

            NotificationRequest request = new NotificationRequest();
            request.setType("TICKET_CREATED");
            request.setTitle("New Ticket Created");
            request.setMessage("Ticket #" + ticketId + ": " + title);
            request.setRecipientId(studentId);

            restTemplate.postForEntity(url, request, Void.class);
            log.info("Notification sent for ticket: {}", ticketId);

        } catch (Exception e) {
            log.error("Failed to send notification for ticket: {}", ticketId, e);
            // Don't fail the ticket creation if notification fails
        }
    }

    public void sendTicketStatusChangedNotification(Integer ticketId, String newStatus, Integer studentId) {
        try {
            String url = notificationServiceUrl + "/api/notifications/send";

            NotificationRequest request = new NotificationRequest();
            request.setType("TICKET_STATUS_CHANGED");
            request.setTitle("Ticket Status Updated");
            request.setMessage("Ticket #" + ticketId + " status changed to: " + newStatus);
            request.setRecipientId(studentId);

            restTemplate.postForEntity(url, request, Void.class);
            log.info("Status change notification sent for ticket: {}", ticketId);

        } catch (Exception e) {
            log.error("Failed to send status change notification for ticket: {}", ticketId, e);
        }
    }

    @Data
    static class NotificationRequest {
        private String type;
        private String title;
        private String message;
        private Integer recipientId;
    }
}
