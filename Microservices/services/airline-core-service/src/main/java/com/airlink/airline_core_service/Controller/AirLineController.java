package com.airlink.airline_core_service.Controller;

import com.airlink.airline_core_service.Model.Airline;
import com.airlink.airline_core_service.Service.AirLineService;
import enums.AirLineStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.AirLineRequest;
import payload.response.AirLineResponse;

@RestController
@RequestMapping("/api/airline")
@RequiredArgsConstructor
public class AirLineController {

    private final AirLineService airLineService;

    @PostMapping("/create/{ownerId}")
    public ResponseEntity<AirLineResponse> createAirline(
            @Valid @RequestBody AirLineRequest request,
            @PathVariable Long ownerId
    ){
        AirLineResponse airline = airLineService.createAirLine(request, ownerId);
        return ResponseEntity.ok(airline);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<AirLineResponse> getAirLineByOwner(
            @PathVariable Long ownerId
    ) throws Exception {
        AirLineResponse id = airLineService.getAirLineByOwner(ownerId);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AirLineResponse> getAirLineById(
            @PathVariable Long id
    ) throws Exception {
        AirLineResponse id1 = airLineService.getAirLineById(id);
        return ResponseEntity.ok(id1);
    }

    @PutMapping("/update/{ownerId}")
    public ResponseEntity<AirLineResponse> updateAirline(
            @RequestBody AirLineRequest request,
            @PathVariable Long ownerId
    ) throws Exception {
        AirLineResponse response = airLineService.updateAirLine(request, ownerId);
        return ResponseEntity.ok(response);
    }
//
//    @GetMapping("/all")
//    public ResponseEntity<AirLineResponse> allAirLines(
//
//    )

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAirLine(
            @PathVariable Long id,
            @PathVariable Long ownerId
    ) throws Exception {
        airLineService.deleteAirLine(id, ownerId);
        return ResponseEntity.ok("Airline Deleted SuccessFully");
    }

    @PutMapping("/{airlineId}/status")
    public ResponseEntity<AirLineResponse> changeStatus(
            @PathVariable Long airlineId,
            @RequestParam AirLineStatus status
            ) throws Exception {
        AirLineResponse response = airLineService.changeStatus(airlineId, status);
        return ResponseEntity.ok(response);
    }
}
