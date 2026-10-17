package Event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCompletedEvent {
    private Long paymentId;
    private Long bookingId;
    private Long userId;
    private Double amount;
    private String transactionId;
    private String providerPaymentId;
    private LocalDateTime paidAt;
}
