package com.AirLink.booking_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import payload.response.FlightInstanceResponse;
import payload.response.FlightResponse;

@FeignClient(name = "flight-ops-service")
public interface FlightClient {

    @GetMapping("/api/flights/{id}")
    FlightResponse getFlightById(@PathVariable Long id);

    @GetMapping("/api/instance/{id}")
    FlightInstanceResponse getFlightInstanceById(@PathVariable Long id);
}
