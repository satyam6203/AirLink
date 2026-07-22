package com.airlink.pricing_service.Controller;

import com.airlink.pricing_service.Service.FareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FareRequest;
import payload.response.FareResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fares")
public class FareController {

    private final FareService fareService;

    @PostMapping("/create")
    public ResponseEntity<FareResponse> createFares(
            @Valid @RequestBody FareRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                fareService.createFare(request)
        );
    }

    @GetMapping()
    public ResponseEntity<?> getFare(){
        return ResponseEntity.status(HttpStatus.OK)
                .body(fareService.getFares());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FareResponse> getFareById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(fareService.getFareById(id));
    }

    @PostMapping("/batch-by-ids")
    public ResponseEntity<Map<Long, FareResponse>> getFaresById(@PathVariable List<Long> ids){
        return ResponseEntity.ok(fareService.getFareByIds(ids));
    }

    @PostMapping("/search")
    public ResponseEntity<Map<Long, FareResponse>> getLowestFarePerFlight(
            @RequestBody List<Long> flightIds,
            @RequestParam Long cabinClassId
    ){
        Map<Long, FareResponse> res = fareService.getLowestFarePerFlight(flightIds, cabinClassId);
        System.out.println("Search fare response --------> " + res.toString());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/flight/{flightId}/cabin-class/{cabinClassId}")
    public ResponseEntity<List<FareResponse>> getFaresByFlightAndCabinClass(
            @PathVariable Long flightId,
            @PathVariable Long cabinClassId
    ){
        return ResponseEntity.ok(fareService.getFaresByFlightIdAndCabinClassId(flightId, cabinClassId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FareResponse> updateFare(
            @PathVariable Long id,
            @Valid @RequestBody FareRequest request
    ) throws Exception {
        return ResponseEntity.ok(fareService.updateFare(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFare(@PathVariable Long id) throws Exception {
        fareService.deleteFare(id);
        return ResponseEntity.noContent().build();
    }
}
