package com.airline.ancillary_service.Controller;

import com.airline.ancillary_service.service.FlightMealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.FlightMealRequest;
import payload.response.FlightMealResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/flight-meals")
public class FlightMealController {

    private final FlightMealService flightMealService;

    @PostMapping("/create")
    public ResponseEntity<FlightMealResponse> createMeal(
            @RequestBody FlightMealRequest request
    ) throws Exception {
        return ResponseEntity.ok(flightMealService.create(request));
    }

    @PostMapping("/price/total")
    public ResponseEntity<Double> calculateMealPrice(
            @RequestBody List<Long> request
    ){
        double response = flightMealService.calculateMealPrice(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlightMealResponse> getFlightMealsById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(flightMealService.getById(id));
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<FlightMealResponse>> getMealsByFlightId(
            @PathVariable Long flightId
    ){
        return ResponseEntity.ok(flightMealService.getByFlightId(flightId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FlightMealResponse>> getAllMeals(
            @PathVariable List<Long> ids
    ){
        return ResponseEntity.ok(flightMealService.getAllByIds(ids));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<FlightMealResponse> updateFlightMeal(
           @PathVariable Long id,
           @RequestBody FlightMealRequest request
    ) throws Exception {
        return ResponseEntity.ok(flightMealService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFlightMeal(
            @PathVariable Long id
    ) throws Exception {
        flightMealService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<FlightMealResponse> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available
    ) throws Exception {
        return ResponseEntity.ok(flightMealService.updateAvailability(id, available));
    }
}
