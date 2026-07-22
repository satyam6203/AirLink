package com.airlink.pricing_service.Controller;

import com.airlink.pricing_service.Service.FareRulesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FareRulesRequest;
import payload.response.FareRulesResponse;

import java.util.List;

@RestController
@RequestMapping("/api/fare-rule/")
@RequiredArgsConstructor
public class FareRuleController {

    private final FareRulesService fareRulesService;

    @PostMapping("/create")
    public ResponseEntity<FareRulesResponse> createFareRule(
            @Valid @RequestBody FareRulesRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                fareRulesService.createRule(request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FareRulesResponse> getFareRule(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(fareRulesService.getFareRulesById(id));
    }

    @GetMapping("/fare/{id}")
    public ResponseEntity<FareRulesResponse> getFareRuleByFareId(
            @PathVariable Long fareId
    ) throws Exception {
        return ResponseEntity.ok(fareRulesService.getFareRulesByFareId(fareId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FareRulesResponse> updateFareRule(
            @PathVariable Long id,
            @Valid @RequestBody FareRulesRequest request
    ) throws Exception {
        return ResponseEntity.ok(fareRulesService.updateFareRules(id, request));
    }

    @GetMapping("/airline/{airlineId}")
    public ResponseEntity<List<FareRulesResponse>> getFareRulesByAirlineId(
            @PathVariable Long airlineId
    ){
        return ResponseEntity.ok(fareRulesService.getFareRulesByAirlineId(airlineId));
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFareRule(
            @PathVariable Long id
    ) throws Exception {
        fareRulesService.deleteFareRules(id);
        return  ResponseEntity.noContent().build();
    }
}
