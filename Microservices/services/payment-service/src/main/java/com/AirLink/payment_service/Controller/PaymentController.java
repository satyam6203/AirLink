package com.AirLink.payment_service.Controller;

import com.AirLink.payment_service.Service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.dto.PaymentDTO;
import payload.request.PaymentInitiateRequest;
import payload.request.PaymentVerifyRequest;
import payload.response.PaymentInitiateResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateResponse> initiatePayment(
            @Valid @RequestBody PaymentInitiateRequest request,
            @RequestHeader("X-User-Id") Long userId) throws Exception {

        PaymentInitiateResponse response = paymentService
                .initiatePayment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request)
            throws Exception {

        log.info("Received payment verification request");
        PaymentDTO payment = paymentService.verifyPayment(request);
        return ResponseEntity.ok(payment);

    }

    @PostMapping("/batch/bookings")
    public ResponseEntity<Map<Long, PaymentDTO>> getPaymentsByBookingIds(@RequestBody List<Long> bookingIds) {
        return ResponseEntity.ok(paymentService
                .getPaymentsByBookingIds(bookingIds));
    }

    @GetMapping
    public ResponseEntity<Page<PaymentDTO>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestHeader("X-User-Id") Long userId) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ?
                Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<PaymentDTO> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(payments);
    }
}
