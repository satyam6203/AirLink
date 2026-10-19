package com.airlink.flight_ops_service.Event;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.airlink.flight_ops_service.Model.FlightInstance;

import Event.FlightInstanceCreateEvent;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class FlightInstanceEventProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendFlightInstanceCreated(FlightInstanceCreateEvent event) {
        kafkaTemplate.send("flight-instance-created", event);
    }
}
