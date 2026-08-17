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

        BigDecimal amount = BigDecimal.valueOf(payment.getAmount());
        Long amountInPaisa = amount.multiply(new BigDecimal("100")).longValue();

        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amountInPaisa);
        paymentLinkRequest.put("currency", "INR");
        paymentLinkRequest.put("description", payment.getTransactionId());

        JSONObject customer = new JSONObject();
        customer.put("name", userDTO.getFullName());
        customer.put("email", userDTO.getEmail());
        if(userDTO.getPhone() != null){
            customer.put("contact", userDTO.getPhone());
        }

        JSONObject notify = new JSONObject();
        notify.put("email", true);
        notify.put("sms", userDTO.getPhone() != null);
        paymentLinkRequest.put("notify", notify);
        paymentLinkRequest.put("customer", customer);

        paymentLinkRequest.put("reminder_enable", true);

        String successUrl = callbackBaseUrl + "/booking-success/" + payment.getBookingId();
        paymentLinkRequest.put("callback_put", successUrl);
        paymentLinkRequest.put("callback_url", successUrl);

        JSONObject notes = new JSONObject();
        notes.put("user_id", userDTO.getId());
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
