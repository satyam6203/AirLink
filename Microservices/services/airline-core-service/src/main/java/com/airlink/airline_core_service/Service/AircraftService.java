package com.airlink.airline_core_service.Service;

import payload.request.AircraftRequest;
import payload.response.AircraftResponse;

import java.util.List;

public interface AircraftService {

    AircraftResponse createAircraft(AircraftRequest request, Long ownerId) throws Exception;
    AircraftResponse updateAircraft(AircraftRequest request, Long ownerId);
    AircraftResponse getById(Long id);
    List<AircraftResponse> listAllAircraftByOwner(Long ownerId);
    void deleteAircraft(Long ownerId, Long id);
}
