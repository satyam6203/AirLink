package com.arilink.seat_service.Controller;

import com.arilink.seat_service.Service.SeatMapService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.SeatMapRequest;
import payload.response.SeatMapResponse;

@RestController
@AllArgsConstructor
@RequestMapping("/api/seat-map")
public class SeatMapController {

    private final SeatMapService seatMapService;

    @PostMapping("/create")
    public ResponseEntity<SeatMapResponse> createSeatMap(
            @Valid @RequestBody SeatMapRequest request,
            @RequestHeader("X-Airline-Id") long airlineId
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                seatMapService.createSeatMap(airlineId, request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatMapResponse> getSeatMapById(
            @PathVariable Long id
    ) throws Exception {
        return  ResponseEntity.ok(seatMapService.getSeatMapById(id));
    }

    @GetMapping("/cabin-class/{cabinClassId}")
    public ResponseEntity<SeatMapResponse> getSeatMapsByCabinClass(
            @PathVariable Long cabinClassId
    ) throws Exception {
        return ResponseEntity.ok(seatMapService.getSeatMapByCabinClass(cabinClassId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SeatMapResponse> updateSeaMap(
            @PathVariable Long id,
            @Valid @RequestBody SeatMapRequest request
    ) throws Exception {
        return ResponseEntity.ok(seatMapService.updateSeatMap(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSeatMap(
            @PathVariable Long id
    ) throws Exception {
        seatMapService.deleteSeatMap(id);
        return ResponseEntity.noContent().build();
    }
}
