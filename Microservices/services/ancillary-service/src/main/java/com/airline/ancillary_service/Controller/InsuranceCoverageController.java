package com.airline.ancillary_service.Controller;

import com.airline.ancillary_service.service.InsuranceCoverageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.InsuranceCoverageRequest;
import payload.response.InsuranceCoverageResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/insurance-coverage")
public class InsuranceCoverageController {

    private final InsuranceCoverageService insuranceCoverageService;

    @PostMapping("/create")
    public ResponseEntity<InsuranceCoverageResponse> createInsurance(
           @Valid @RequestBody InsuranceCoverageRequest request
    ) throws Exception {
        return ResponseEntity.ok(insuranceCoverageService.createCoverage(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<InsuranceCoverageResponse> updatedConverge(
            @PathVariable Long id,
            @RequestBody InsuranceCoverageRequest request
    ) throws Exception {
        return ResponseEntity.ok(insuranceCoverageService.updateCoverage(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteConverge(
            @PathVariable Long id
    ) throws Exception {
        insuranceCoverageService.deleteCoverage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active-coverages/{ancillaryId}")
    public ResponseEntity<List<InsuranceCoverageResponse>> getActiveCoveragesByAncillary(
            @PathVariable Long ancillaryId
    ){
        return ResponseEntity.ok(insuranceCoverageService.getActiveCoveragesByAncillaryId(ancillaryId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<InsuranceCoverageResponse>> getAllConverge(){
        return ResponseEntity.ok(insuranceCoverageService.getAllCoverages());
    }

    @GetMapping("/{ancillaryId}")
    public ResponseEntity<List<InsuranceCoverageResponse>>  getCoveragesByAncillary(
            @PathVariable Long ancillaryId
    ){
        return ResponseEntity.ok(insuranceCoverageService.getCoveragesByAncillaryId(ancillaryId));
    }
}
