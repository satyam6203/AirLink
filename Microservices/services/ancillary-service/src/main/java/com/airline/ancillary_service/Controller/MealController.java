package com.airline.ancillary_service.Controller;

import com.airline.ancillary_service.Model.Meal;
import com.airline.ancillary_service.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.request.MealRequest;
import payload.response.MealResponse;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    @PostMapping("/create")
    public ResponseEntity<MealResponse> createMeal(
           @Valid @RequestBody MealRequest request,
           @RequestHeader("X-Airline-Id") Long airlineId
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                mealService.create(airlineId, request)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealResponse> getMealById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(mealService.getById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MealResponse>> getAllMealByAirLineId(
            @PathVariable Long airlineId
    ){
        return ResponseEntity.ok(mealService.getByAirlineId(airlineId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MealResponse> updateMeal(
            @PathVariable Long id,
            @RequestBody MealRequest request,
            @RequestHeader("X-Airline-Id") Long airlineId
    ) throws Exception {
        return ResponseEntity.ok(mealService.update(airlineId, id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMeal(
            @PathVariable Long id
    ) throws Exception {
        mealService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealResponse> isAvailableMeal(
            @PathVariable Long id,
            @RequestParam Boolean available
    ) throws Exception {
        return ResponseEntity.ok(mealService.updateAvailability(id, available));
    }

    @GetMapping("/airline")
    public ResponseEntity<List<MealResponse>> getMealByAirLineId(
            @RequestHeader("X-Airline-Id") Long airlineId
    ){
        return ResponseEntity.ok(mealService.getByAirlineId(airlineId));
    }
}
