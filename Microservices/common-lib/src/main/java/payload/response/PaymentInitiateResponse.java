package payload.response;

import enums.PaymentGateway;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateResponse {

    private Long paymentId;
    private PaymentGateway gateway;
    private String transactionId;

    private String razorpayOrderId;

    private Double amount;
    private String description;

    private String checkoutUrl;

    private String message;
    private Boolean success;
}
