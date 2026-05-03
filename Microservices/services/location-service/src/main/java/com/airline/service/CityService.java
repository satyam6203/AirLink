package com.airline.service;

import org.springframework.data.domain.Page;
import payload.request.CityRequest;
import payload.response.CityResponse;

import java.awt.print.Pageable;

public interface CityService {

    CityResponse createCity(CityRequest req);
    CityResponse getCityById(Long id);

    CityResponse updateCity(Long id, CityRequest request);
    void deleteCity(Long id);
    Page<CityResponse> getAllCities(Pageable pageable);

    Page<CityResponse> searchCities(String keyword, Pageable pageable);
    Page<CityResponse> getCityByCountryCode(String countryCode, Pageable pageable);

    boolean cityExists(String cityCode);
    boolean validateCityCode(String cityCode);
}
