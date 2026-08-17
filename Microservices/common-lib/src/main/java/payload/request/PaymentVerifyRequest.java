package payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentVerifyRequest {

    private String razorpayPaymentId;

    private String stripePaymentIntentId;

}
