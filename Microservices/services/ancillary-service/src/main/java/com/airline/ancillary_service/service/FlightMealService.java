package com.airline.ancillary_service.service;

import payload.request.FlightMealRequest;
import payload.response.FlightMealResponse;

import java.util.List;

public interface FlightMealService {

    FlightMealResponse create(FlightMealRequest request) throws Exception;

    FlightMealResponse getById(Long id) throws Exception;

    List<FlightMealResponse> getByFlightId(Long flightId);

    List<FlightMealResponse> getAllByIds(List<Long> Ids);

    FlightMealResponse update(Long id, FlightMealRequest request) throws Exception;

    void delete(Long id) throws Exception;

    FlightMealResponse updateAvailability(Long id, Boolean available) throws Exception;

    Double calculateMealPrice(List<Long> mealIds);
}
