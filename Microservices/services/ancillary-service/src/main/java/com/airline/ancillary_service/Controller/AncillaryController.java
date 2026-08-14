package com.airline.ancillary_service.Controller;

import com.airline.ancillary_service.service.AncillaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.AncillaryRequest;
import payload.response.AncillaryResponse;

import java.util.List;

@RestController
@RequestMapping("/api/ancillary")
@RequiredArgsConstructor
public class AncillaryController {

    private final AncillaryService ancillaryService;

    @PostMapping("/create")
    public ResponseEntity<AncillaryResponse> create(
            @Valid @RequestBody AncillaryRequest request,
            @RequestHeader("X-AirlineId-Id") Long airlineId
    ) throws Exception {
        return ResponseEntity.ok(ancillaryService.create(airlineId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AncillaryResponse> getById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(ancillaryService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<AncillaryResponse>> getAllByAirlineId(
            @RequestHeader("X-AirlineId-Id") Long airlineId
    ){
        return ResponseEntity.ok(ancillaryService.getAllByAirlineId(airlineId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AncillaryResponse> update(
            @PathVariable Long id,
            @RequestBody AncillaryRequest request
    ) throws Exception {
        return ResponseEntity.ok(ancillaryService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws Exception {
        ancillaryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
