package com.AirLink.booking_service.Client;

import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import payload.request.PaymentInitiateRequest;
import payload.response.PaymentInitiateResponse;

@FeignClient(name = "payment-service")
public interface PaymentClient {

    @PostMapping("/api/payments/initiate")
    PaymentInitiateResponse initiatePayment(
            @Valid @RequestBody PaymentInitiateRequest request
    );
}
