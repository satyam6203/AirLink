package com.arilink.seat_service.Controller;

import com.arilink.seat_service.Service.FlightInstanceService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FlightInstanceCabinRequest;
import payload.response.FlightInstanceCabinResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/flight-instance-cabins")
public class FlightInstanceCabinController {

    private final FlightInstanceService flightInstanceService;

    @PostMapping("/create")
    public ResponseEntity<FlightInstanceCabinResponse> createInstanceCabin(
            @RequestBody FlightInstanceCabinRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                flightInstanceService.createFlightInstanceCabin(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightInstanceCabinResponse> getInstanceCabinById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(flightInstanceService.getFlightInstanceCabinById(id));
    }

    @GetMapping("/flight-instance/{flightInstanceId}/cabin-class/{cabinClassId}")
    public ResponseEntity<?> getByFlightInstanceIdAndCabinClassId(
            @PathVariable Long cabinClassId,
            @PathVariable Long flightInstanceId
    ){
        return ResponseEntity.ok(flightInstanceService.getByFlightInstanceIdAndCabinClassId(
                flightInstanceId,
                cabinClassId
        ));
    }

    @GetMapping("/flight-instance/{flightInstanceId}")
    public ResponseEntity<Page<FlightInstanceCabinResponse>> getByFlightInstanceId(
            @PathVariable Long flightInstanceId,
            Pageable pageable
    ){
        return ResponseEntity.ok(
                flightInstanceService.getByFlightInstanceId(flightInstanceId, pageable)
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlightInstanceCabinResponse> updateFlightInstanceCabin(
            @PathVariable Long id,
            @RequestBody FlightInstanceCabinRequest request
    ) throws Exception {
        return ResponseEntity.ok(
                flightInstanceService.updateFlightInstanceCabin(id, request)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFlightInstanceCabin(
            @PathVariable Long id
    ) throws Exception {
        flightInstanceService.deleteFlightInstanceCabin(id);
        return ResponseEntity.noContent().build();
    }
}
