package com.airline.ancillary_service.Mapper;

import com.airline.ancillary_service.Model.FlightMeal;
import payload.response.FlightMealResponse;

public class FlightMealMapper {

    public static FlightMealResponse toResponse(FlightMeal flightMeal) {
        if (flightMeal == null) {
            return null;
        }

        return FlightMealResponse.builder()
                .id(flightMeal.getId())
                .flightId(flightMeal.getFlightId())
                .meal(MealMapper.toResponse(flightMeal.getMeal()))
                .available(flightMeal.getIsAvailable())
                .price(flightMeal.getPrice())
                .displayOrder(flightMeal.getDisplayOrder())
                .build();
    }
}
