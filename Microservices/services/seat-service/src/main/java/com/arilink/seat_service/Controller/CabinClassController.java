package com.arilink.seat_service.Controller;

import com.arilink.seat_service.Service.CabinClassService;
import enums.CabinClassType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.CabinClassRequest;
import payload.response.CabinClassResponse;

import java.util.List;

@RestController
@RequestMapping("/api/cabin-classes")
@RequiredArgsConstructor
public class CabinClassController {

    private final CabinClassService cabinClassService;

    @PostMapping("/create")
    private ResponseEntity<CabinClassResponse> createCabinClass(
            @RequestBody CabinClassRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                cabinClassService.createCabinClass(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CabinClassResponse> getCabinClassById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(cabinClassService.getCabinClassById(id));
    }

    @GetMapping("/aircraft/{id}/name/{cabinClass}")
    public ResponseEntity<CabinClassResponse> getCabinClassByAircraftIdAndName(
            @PathVariable CabinClassType cabinClass,
            @PathVariable Long id
    ){
        return ResponseEntity.ok(
                cabinClassService.getByAircraftIdAndName(
                        id, cabinClass
                )
        );
    }

    @GetMapping("/aircraft/{aircraft}")
    public ResponseEntity<List<CabinClassResponse>> getCabinClassesByAirCraftId(
            @PathVariable Long aircraftId
    ){
        return ResponseEntity.ok(cabinClassService.getCabinClassesByAircraftId(aircraftId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CabinClassResponse> updateCabinClass(
            @PathVariable Long id,
            @Valid @RequestBody CabinClassRequest request
    ) throws Exception {
        return ResponseEntity.ok(cabinClassService.updatedCabinClass(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCabinClass(
            @PathVariable Long id
    ) throws Exception {
        cabinClassService.deleteCabinClass(id);
        return ResponseEntity.noContent().build();
    }
}
