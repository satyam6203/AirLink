package com.AirLink.payment_service.Event;

import Event.PaymentCompletedEvent;
import com.AirLink.payment_service.Model.Payment;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentEventProducer {

    private static final String PAYMENT_COMPLETED_TOPIC = "payment-completed";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PaymentEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void paymentCompleted(Payment payment) {
        PaymentCompletedEvent event = PaymentCompletedEvent.builder()
                .paymentId(payment.getId())
                .bookingId(payment.getBookingId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .transactionId(payment.getTransactionId())
                .providerPaymentId(payment.getProviderPaymentId())
                .paidAt(payment.getPaidAt())
                .build();

        kafkaTemplate.send(PAYMENT_COMPLETED_TOPIC, event.getTransactionId(), event);
    }
}
