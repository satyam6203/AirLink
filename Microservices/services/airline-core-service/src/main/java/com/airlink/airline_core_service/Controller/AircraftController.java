package com.airlink.airline_core_service.Controller;

import com.airlink.airline_core_service.Service.AircraftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.AircraftRequest;
import payload.response.AircraftResponse;

import java.util.List;

@RestController
@RequestMapping("/api/aircraft")
@RequiredArgsConstructor
public class AircraftController {

    private final AircraftService aircraftService;

    @PostMapping("/create")
    public ResponseEntity<AircraftResponse> createAircraft(
            @Valid @RequestBody AircraftRequest  request,
            @RequestHeader("X-User-Id") Long userId
    ) throws Exception {

        AircraftResponse response  = aircraftService.createAircraft(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AircraftResponse> getAircraftById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(aircraftService.getAircraftById(id));
    }

    @GetMapping("/list")
    public ResponseEntity<List<AircraftResponse>> listAllAircraft(
            @RequestHeader("X-User-Id") Long userId
    ) throws Exception {
        return ResponseEntity.ok(aircraftService.listAllAircraftByOwner(userId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AircraftResponse> updateAircraft(
            @PathVariable Long id,
            @RequestBody AircraftRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) throws Exception {
        return ResponseEntity.ok(aircraftService.updateAircraft(id, request, userId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAircraft(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId
    ) throws Exception {
        aircraftService.deleteAircraft(id, userId);
        return ResponseEntity.ok().body("Aircraft Deleted SuccessFully");
    }
}
