package com.airlink.flight_ops_service.Controller;

import com.airlink.flight_ops_service.Service.FlightService;
import enums.FlightStatus;
import jakarta.persistence.EntityListeners;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import payload.request.FlightRequest;
import payload.response.FlightResponse;

import javax.naming.ldap.PagedResultsControl;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping("/create")
    public ResponseEntity<FlightResponse> createFlight(
            @Valid @RequestBody FlightRequest request,
            @RequestHeader("Airline-Id") Long airlineId
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                flightService.createFLight(airlineId, request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightResponse> getFlightById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }

    @GetMapping("/airline")
    public ResponseEntity<Page<FlightResponse>> getFlightByAirline(
            @RequestHeader("Airline-Id") Long airlineId,
            @RequestParam(required = false) Long departureAirportId,
            @RequestParam(required = false) Long arrivalAirportId,
            Pageable pageable
    ){
        return ResponseEntity.ok(flightService.getFlightByAirline(
                airlineId,
                departureAirportId,
                arrivalAirportId,
                pageable
        ));

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlightResponse> updateFlight(
            @PathVariable Long id,
            @RequestBody FlightRequest request
    ) throws Exception {
        return ResponseEntity.ok(flightService.updateFlight(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FlightResponse> changeStatus(
            @PathVariable Long id,
            @RequestParam FlightStatus status
    ) throws Exception {
        return ResponseEntity.ok(flightService.changeStatus(id, status));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id,
                                             @RequestHeader("Airline-Id") Long airlineId
    ) throws Exception {
        flightService.deleteFlight(airlineId, id);
        return ResponseEntity.noContent().build();
    }
}
