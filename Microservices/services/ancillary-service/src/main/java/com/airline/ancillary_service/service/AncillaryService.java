package com.airline.ancillary_service.service;

import payload.request.AncillaryRequest;
import payload.response.AncillaryResponse;

import java.util.List;

public interface AncillaryService {

    AncillaryResponse create(Long userId, AncillaryRequest request) throws Exception;

    AncillaryResponse getById(Long id) throws Exception;

    List<AncillaryResponse> getAllByAirlineId(Long userId);

    AncillaryResponse update(Long id, AncillaryRequest request) throws Exception;

    void delete(Long id);
}
