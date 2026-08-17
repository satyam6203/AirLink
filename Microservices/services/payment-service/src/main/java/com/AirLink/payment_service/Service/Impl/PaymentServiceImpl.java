package com.AirLink.payment_service.Service.Impl;

import com.AirLink.payment_service.Mapper.PaymentMapper;
import com.AirLink.payment_service.Model.Payment;
import com.AirLink.payment_service.Repo.PaymentRepo;
import com.AirLink.payment_service.Service.PaymentService;
import com.AirLink.payment_service.Service.gateway.RazorpayService;
import enums.PaymentGateway;
import enums.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import payload.dto.PaymentDTO;
import payload.dto.UserDTO;
import payload.request.PaymentInitiateRequest;
import payload.request.PaymentVerifyRequest;
import payload.response.PaymentInitiateResponse;
import payload.response.PaymentLinkResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepo paymentRepo;
    private final RazorpayService razorpayService;

    @Override
    public PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) throws Exception {
        paymentRepo.findByBookingId(request.getBookingId())
                .ifPresent(
                        payment -> {
                            if(payment.getStatus() == PaymentStatus.SUCCESS){
                                throw new RuntimeException("payment already completed for this booking");
                            }
                        }
                );
        Payment payment = Payment.builder()
                .userId(request.getUserId())
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .provider(request.getGateway())
                .status(PaymentStatus.PENDING)
                .transactionId(generateTransactionId())
                .build();

        payment = paymentRepo.save(payment);

        PaymentInitiateResponse response = PaymentInitiateResponse.builder()
                .paymentId(payment.getId())
                .gateway(request.getGateway())
                .transactionId(payment.getTransactionId())
                .amount(request.getAmount())
                .description(request.getDescription())
                .success(true)
                .message("Payment initiated successfully")
                .build();

        if(request.getGateway() == PaymentGateway.RAZORPAY){
            UserDTO userDTO = new UserDTO();
            userDTO.setId(1L);
            userDTO.setFullName("Satyam Singh");
            userDTO.setEmail("satyam@gmail.com");
            userDTO.setPhone("123456789");

            PaymentLinkResponse paymentLinkResponse = razorpayService.createPaymentLink(
                    userDTO, payment
            );

            response.setRazorpayOrderId(paymentLinkResponse.getPayment_link_id());
            response.setCheckoutUrl(paymentLinkResponse.getPayment_link_url());
        }

        return response;
    }

    @Override
    public PaymentDTO verifyPayment(PaymentVerifyRequest request) throws Exception {
        JSONObject paymentDetails = razorpayService.fetchPaymentObject(
                request.getRazorpayPaymentId()
        );

        String status = paymentDetails.optString("status");
        JSONObject notes = paymentDetails.getJSONObject("notes");
        Long paymentId = Long.parseLong(notes.optString("payment_id"));

        Payment payment1 = paymentRepo.findById(paymentId).orElseThrow(
                () -> new Exception("payment not found")
        );

        boolean isValid = "capture".equalsIgnoreCase(status);
        if(isValid){
            if(payment1.getProvider() == PaymentGateway.RAZORPAY){
                payment1.setProviderPaymentId(request.getRazorpayPaymentId());
            }
            payment1.setStatus(PaymentStatus.SUCCESS);
            payment1.setPaidAt(LocalDateTime.now());
            paymentRepo.save(payment1);
        }
        else{
            payment1.setStatus(PaymentStatus.FAILED);
            payment1.setFailureReason("Payment verification failed");
            paymentRepo.save(payment1);
        }
        return PaymentMapper.toDTO(payment1);
    }

    @Override
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        return paymentRepo.findAll(pageable)
                .map(PaymentMapper:: toDTO);
    }

    @Override
    public Map<Long, PaymentDTO> getPaymentsByBookingIds(List<Long> bookingIds) {
        return paymentRepo.findByBookingIdIn(bookingIds).stream()
                .collect(Collectors.toMap(Payment::getBookingId, PaymentMapper::toDTO));
    }

    private String generateTransactionId() {
        return "TXN_" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
