package payload.dto;

import enums.PaymentGateway;
import enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PaymentDTO {

    private Long id;

    private Long userId;
    private String userName;
    private String userEmail;

    private Long bookingId;
    private PaymentStatus status;
    private PaymentGateway gateway;
    private Long amount;
    private String transactionId;
    private String gatewayPaymentId;
    private String gatewayOrderId;
    private String gatewaySignature;

    private String description;
    private String failureReason;

    private LocalDateTime initiatedAt;
    private LocalDateTime completedAt;

    private Boolean notificationSent;
    private Boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
