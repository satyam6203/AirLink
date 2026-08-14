package com.airline.ancillary_service.Controller;

import com.airline.ancillary_service.service.FlightCabinAncillaryService;
import enums.AncillaryType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FlightCabinAncillaryRequest;
import payload.response.FlightCabinAncillaryResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/flight-cabin-ancillaries")
public class FlightCabinAncillaryController {

    private final FlightCabinAncillaryService flightCabinAncillaryService;

    @PostMapping("/create")
    public ResponseEntity<FlightCabinAncillaryResponse> create(
            @Valid @RequestBody FlightCabinAncillaryRequest request)
            throws Exception {
        return ResponseEntity.ok(flightCabinAncillaryService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightCabinAncillaryResponse> getById(@PathVariable Long id)
            throws Exception {
        return ResponseEntity.ok(flightCabinAncillaryService.getById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FlightCabinAncillaryResponse>> getAllByIds(
            @RequestParam List<Long> Ids) {
        return ResponseEntity.ok(flightCabinAncillaryService.getAllByIds(Ids));
    }

    @GetMapping("/flight/{flightId}/cabin/{cabinClassId}")
    public ResponseEntity<List<FlightCabinAncillaryResponse>> getAllByFlightAndCabinClass(
            @PathVariable Long flightId,
            @PathVariable Long cabinClassId) {
        return ResponseEntity.ok(flightCabinAncillaryService.getAllByFlightAndCabinClass(flightId, cabinClassId));
    }

    @GetMapping("/flight/{flightId}/cabin/{cabinClassId}/type/{type}")
    public ResponseEntity<FlightCabinAncillaryResponse> getByFlightAndCabinClassAndType(
            @PathVariable Long flightId,
            @PathVariable Long cabinClassId,
            @PathVariable AncillaryType type) throws Exception {
        return ResponseEntity.ok(
                flightCabinAncillaryService.getByFlightIdAndCabinClassAndType(flightId, cabinClassId, type));
    }

    @GetMapping("/flight/{flightId}/cabin/{cabinClassId}/type/{type}/all")
    public ResponseEntity<?> getAllByFlightAndCabinClassAndType(
            @PathVariable Long flightId,
            @PathVariable Long cabinClassId,
            @PathVariable AncillaryType type) throws Exception {
        return ResponseEntity.ok(
                flightCabinAncillaryService.getAllByFlightIdAndCabinClassAndType(flightId, cabinClassId, type));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlightCabinAncillaryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody FlightCabinAncillaryRequest request)
            throws Exception {
        return ResponseEntity.ok(flightCabinAncillaryService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
        flightCabinAncillaryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/price/total")
    public ResponseEntity<?> calculateAncillariesPrice(
            @RequestBody List<Long> flightCabinAncillaryIds)
    {
        return ResponseEntity.ok(flightCabinAncillaryService.calculateAncillaryPrice(flightCabinAncillaryIds));
    }
}
