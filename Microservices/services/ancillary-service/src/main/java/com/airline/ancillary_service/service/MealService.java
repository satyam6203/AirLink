package com.airline.ancillary_service.service;


import payload.request.MealRequest;
import payload.response.MealResponse;

import java.util.List;

public interface MealService {

    MealResponse create(Long userId, MealRequest request) throws Exception;

    List<MealResponse> bulkCreate(Long userId, List<MealRequest> requests) throws Exception;

    MealResponse getById(Long id) throws Exception;

    List<MealResponse> getByAirlineId(Long userId);

    MealResponse update(Long userId, Long id, MealRequest request) throws Exception;

    void delete(Long id) throws Exception;

    MealResponse updateAvailability(Long id, Boolean available) throws Exception;
}
