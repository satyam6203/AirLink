package com.arilink.seat_service.Event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import Event.PaymentCompletedEvent;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class PaymentEventListner {
    
    @KafkaListener(topics = "payment_compelted", groupId = "seat-service-group")
    public void handelPaymentCompeleted(PaymentCompletedEvent event) {
        
    }
}
