package com.AirLink.payment_service.Service.gateway;

import com.AirLink.payment_service.Model.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import payload.dto.UserDTO;
import payload.response.PaymentLinkResponse;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    @Value("${razorpay.api.key}")
    private String razorpayKeyId;

    @Value("${razorpay.api.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.callback.base-url}")
    private String callbackBaseUrl;

    public PaymentLinkResponse createPaymentLink(UserDTO userDTO, Payment payment) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        BigDecimal amount = BigDecimal.valueOf(payment.getAmount() != null && payment.getAmount() > 0 ? payment.getAmount() : 1.0);
        Long amountInPaisa = amount.multiply(new BigDecimal("100")).longValue();
        if (amountInPaisa < 100) {
            amountInPaisa = 100L;
        }

        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amountInPaisa);
        paymentLinkRequest.put("currency", "INR");
        paymentLinkRequest.put("description", payment.getTransactionId());

        String customerName = (userDTO != null && userDTO.getFullName() != null && !userDTO.getFullName().isBlank())
                ? userDTO.getFullName().trim() : "Passenger";
        String customerEmail = (userDTO != null && userDTO.getEmail() != null && !userDTO.getEmail().isBlank())
                ? userDTO.getEmail().trim() : "passenger@airlink.com";

        JSONObject customer = new JSONObject();
        customer.put("name", customerName);
        customer.put("email", customerEmail);
        if(userDTO != null && userDTO.getPhone() != null && !userDTO.getPhone().isBlank()){
            customer.put("contact", userDTO.getPhone().trim());
        }

        JSONObject notify = new JSONObject();
        notify.put("email", true);
        notify.put("sms", userDTO != null && userDTO.getPhone() != null && !userDTO.getPhone().isBlank());
        paymentLinkRequest.put("notify", notify);
        paymentLinkRequest.put("customer", customer);

        paymentLinkRequest.put("reminder_enable", true);

        String successUrl = callbackBaseUrl + "/booking-success/" + payment.getBookingId();
        paymentLinkRequest.put("callback_url", successUrl);
        paymentLinkRequest.put("callback_method", "get");

        JSONObject notes = new JSONObject();
        notes.put("user_id", userDTO != null && userDTO.getId() != null ? userDTO.getId() : payment.getUserId());
        notes.put("payment_id", payment.getId());
        notes.put("booking_id", payment.getBookingId());

        paymentLinkRequest.put("notes", notes);

        PaymentLink paymentLink = razorpay.paymentLink.create(paymentLinkRequest);
        String paymentUrl = paymentLink.get("short_url");
        String paymentLinkId = paymentLink.get("id");

        PaymentLinkResponse response = PaymentLinkResponse.builder()
                .payment_link_id(paymentLinkId)
                .payment_link_url(paymentUrl)
                .build();

        return response;
    }

    public JSONObject fetchPaymentObject(String paymentId) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        com.razorpay.Payment payment = razorpay.payments.fetch(paymentId);
        return payment.toJson();
    }

}
