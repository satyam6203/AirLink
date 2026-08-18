package com.airlink.flight_ops_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;

@FeignClient(name = "airline-core-service")
public interface AirlineClient {

    @GetMapping("/api/airlines/{id}")
    AirLineResponse getAirLineById(
            @PathVariable Long id
    );

    @GetMapping("/api/aircraft/{id}")
    AircraftResponse getAircraftById(
            @PathVariable Long id
    );
}
