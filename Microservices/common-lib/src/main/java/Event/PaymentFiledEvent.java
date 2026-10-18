package Event;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
@RequiredArgsConstructor 
@Builder 
public class PaymentFiledEvent {
    private Long paymentId;
    private Long bookingId;
    private Long userId;
    private Double amount;
    private String transactionId;
    private String failureReason;
    private LocalDateTime failedAt;
}
