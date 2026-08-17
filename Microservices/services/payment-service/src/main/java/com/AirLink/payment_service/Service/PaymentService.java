package com.AirLink.payment_service.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import payload.dto.PaymentDTO;
import payload.request.PaymentInitiateRequest;
import payload.request.PaymentVerifyRequest;
import payload.response.PaymentInitiateResponse;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) throws Exception;

    PaymentDTO verifyPayment(PaymentVerifyRequest request) throws Exception;

    Page<PaymentDTO> getAllPayments(Pageable pageable);

    Map<Long, PaymentDTO> getPaymentsByBookingIds(List<Long> bookingIds);
}
