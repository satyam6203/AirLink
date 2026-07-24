package com.arilink.seat_service.Service;

import enums.CabinClassType;
import payload.request.CabinClassRequest;
import payload.response.CabinClassResponse;

import java.util.List;

public interface CabinClassService {

    CabinClassResponse createCabinClass(CabinClassRequest request) throws Exception;
    CabinClassResponse getCabinClassById(Long id) throws Exception;
    List<CabinClassResponse> getCabinClassesByAircraftId(Long aircraftId);
    CabinClassResponse getByAircraftIdAndName(Long aircraftId, CabinClassType name);
    CabinClassResponse updatedCabinClass(Long id, CabinClassRequest request) throws Exception;
    void deleteCabinClass(Long id) throws Exception;

}
