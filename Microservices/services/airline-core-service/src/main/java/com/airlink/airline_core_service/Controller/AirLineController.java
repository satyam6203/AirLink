package com.airlink.airline_core_service.Controller;

import com.airlink.airline_core_service.Service.AirLineService;
import enums.AirLineStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.AirLineRequest;
import payload.response.AirLineDropdownItem;
import payload.response.AirLineResponse;

import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
@RequiredArgsConstructor
public class AirLineController {

    private final AirLineService airLineService;

    @PostMapping("/create")
    public ResponseEntity<AirLineResponse> createAirline(
            @Valid @RequestBody AirLineRequest request,
            @RequestHeader("X-User-id") Long userId
    ){
        AirLineResponse airline = airLineService.createAirLine(request, userId);
        return ResponseEntity.ok(airline);
    }

    @GetMapping("/admin")
    public ResponseEntity<AirLineResponse> getAirLineByOwner(
            @RequestHeader("X-User-id") Long ownerId
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

    // Controller
    @GetMapping("/all")
    public ResponseEntity<Page<AirLineResponse>> allAirLines(Pageable pageable) {
        return ResponseEntity.ok(
                airLineService.getAllAirLines(pageable)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAirLine(
            @PathVariable Long id,
            @RequestHeader("X-User-id") Long userId
    ) throws Exception {
        airLineService.deleteAirLine(id, userId);
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

    @GetMapping("/dropdown")
    public ResponseEntity<List<AirLineDropdownItem>> getAirLinesForDropDown(){
        return ResponseEntity.ok(airLineService.getAirLineDropDown());
    }

    @PutMapping("/update")
    public ResponseEntity<AirLineResponse> updateAirLine(
            @Valid @RequestBody AirLineRequest request,
            @RequestHeader("X-User-Id") Long userId
    ) throws Exception {
        return ResponseEntity.ok(airLineService.updateAirLine(request, userId));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<AirLineResponse> approveAirline(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(airLineService.changeStatus(id,AirLineStatus.ACTIVE ));
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<AirLineResponse> suspendAirline(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(airLineService.changeStatus(id,AirLineStatus.INACTIVE));
    }

    @PostMapping("/{id}/ban")
    public ResponseEntity<AirLineResponse> BanAirline(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(airLineService.changeStatus(id,AirLineStatus.BANNED ));
    }
}
