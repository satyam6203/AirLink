package com.airlink.pricing_service.Controller;

import com.airlink.pricing_service.Model.Fare;
import com.airlink.pricing_service.Service.BaggagePolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.BaggagePolicyRequest;
import payload.response.BaggagePolicyResponse;

import java.util.List;

@RestController
@RequestMapping("/api/baggage-policies")
@RequiredArgsConstructor
public class BaggagePolicyController {

    private final BaggagePolicyService baggagePolicyService;

    @PostMapping("/create")
    public ResponseEntity<BaggagePolicyResponse> createBaggagePolicy(
            @RequestBody BaggagePolicyRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                baggagePolicyService.createBaggagePolicy(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaggagePolicyResponse> getBaggagePolicyById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(baggagePolicyService.getBaggagePolicyById(id));
    }

    @GetMapping("/fare/{fareId}")
    public ResponseEntity<BaggagePolicyResponse> getBaggagePolicyByFareId(
            @PathVariable Long fareId
    ) throws Exception {
        return ResponseEntity.ok(baggagePolicyService.getBaggagePolicyByFareId(fareId));
    }

    @GetMapping("/airline/{airlineId}")
    public ResponseEntity<List<BaggagePolicyResponse>> getBaggagePoliciesByAirlineId(
            @PathVariable Long airlineId
    ){
        return ResponseEntity.ok(baggagePolicyService.getBaggagePoliciesByAirlineId(airlineId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BaggagePolicyResponse> updateBaggagePolicy(
            @PathVariable Long id,
            @Valid @RequestBody BaggagePolicyRequest request
    ) throws Exception {
        return ResponseEntity.ok(baggagePolicyService.updateBaggagePolicy(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBaggagePolicy(
            @PathVariable Long id
    ) throws Exception {
        baggagePolicyService.deletedPolicy(id);
        return ResponseEntity.noContent().build();
    }
}
