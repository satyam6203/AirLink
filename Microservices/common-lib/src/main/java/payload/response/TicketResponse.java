package payload.response;

import enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class TicketResponse {
    private Long id;
    private String ticketNumber;
    private TicketStatus status;
    private LocalDateTime issuedAt;

    private Long bookingId;
    private String bookingReference;

    private Long passengerId;
    private String passengerFirstName;
    private String passengerLastName;
    private String passengerEmail;

    private Long paymentId;
    private Double paymentAmount;
    private String paymentCurrency;
}
