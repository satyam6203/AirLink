package com.airlink.flight_ops_service.Controller;

import com.airlink.flight_ops_service.Service.FlightInstanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FlightInstanceRequest;
import payload.response.FlightInstanceResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instance")
public class FlightInstanceController {

    private final FlightInstanceService flightInstanceService;

    @PostMapping("/create")
    public ResponseEntity<FlightInstanceResponse> createFlightInstance(
            @RequestHeader("X-Airline-Id") Long airlineId,
            @Valid  @RequestBody FlightInstanceRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                flightInstanceService.createFlightInstance(airlineId,request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightInstanceResponse> getFlightInstanceById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(flightInstanceService.getFlightInstanceBuId(id));
    }

    @GetMapping()
    public ResponseEntity<Page<FlightInstanceResponse>> getByAirlineId(
            @RequestHeader("X-Airline-Id") Long airlineId,
            @RequestParam(required = false) Long departureAirportId,
            @RequestParam(required = false) Long arrivalAirportId,
            @RequestParam(required = false) Long flightId,
            @RequestParam(required = false) LocalDate onDate,
            Pageable pageable
            ){
        return ResponseEntity.ok(flightInstanceService.getByAirlineId(
                airlineId,
                departureAirportId,
                arrivalAirportId,
                flightId,
                onDate,
                pageable
        ));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlightInstanceResponse> updateFlightInstance(
            @PathVariable Long id,
            @RequestBody FlightInstanceRequest request
    ) throws Exception {
        return ResponseEntity.ok(flightInstanceService.updateLightInstance(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLightInstance(
            @PathVariable Long id
    ) throws Exception {
        flightInstanceService.deleteLightInstance(id);
        return ResponseEntity.noContent().build();
    }
}
