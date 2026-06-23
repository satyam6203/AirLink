package com.airline.service;

import java.util.List;

import payload.request.AirportRequest;
import payload.response.AirportResponse;

public interface AirportService {
    AirportResponse createAirport(AirportRequest request) throws Exception;
    AirportResponse getAirportById(Long id) throws Exception;

    List<AirportResponse> getAllAirports();
    AirportResponse updateAirport(Long id, AirportRequest request) throws Exception;
    
    void deleteAirport(long id) throws Exception;
    List<AirportResponse> getAirportByCityId(Long cityId);
}
