package com.airline.ancillary_service.service;


import payload.request.MealRequest;
import payload.response.MealResponse;

import java.util.List;

public interface MealService {

    MealResponse create(Long userId, MealRequest request) throws Exception;

    MealResponse getById(Long id) throws Exception;

    List<MealResponse> getByAirlineId(Long airlineId);

    MealResponse update(Long airlineId, Long id, MealRequest request) throws Exception;

    void delete(Long id) throws Exception;

    MealResponse updateAvailability(Long id, Boolean available) throws Exception;
}
