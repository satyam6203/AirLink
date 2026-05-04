package com.airline.service;


import payload.request.CityRequest;
import payload.response.CityResponse;

import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Page;

public interface CityService {

    CityResponse createCity(CityRequest req) throws Exception;
    CityResponse getCityById(Long id) throws Exception;

    CityResponse updateCity(Long id, CityRequest request) throws Exception;
    void deleteCity(Long id) throws Exception;
    Page<CityResponse> getAllCities(Pageable pageable);

    Page<CityResponse> searchCities(String keyword, Pageable pageable);
    Page<CityResponse> getCityByCountryCode(String countryCode, Pageable pageable);

    boolean cityExists(String cityCode);

}
