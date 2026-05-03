package com.airline.service.impl;

import com.airline.Repo.CityRepo;
import com.airline.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import payload.request.CityRequest;
import payload.response.CityResponse;

import java.awt.print.Pageable;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {

    private final CityRepo cityRepo;

    @Override
    public CityResponse createCity(CityRequest req) {
        CityResponse newUser = new CityResponse();
//        newUser.setName();
        return null;
    }

    @Override
    public CityResponse getCityById(Long id) {
        return null;
    }

    @Override
    public CityResponse updateCity(Long id, CityRequest request) {
        return null;
    }

    @Override
    public void deleteCity(Long id) {

    }

    @Override
    public Page<CityResponse> getAllCities(Pageable pageable) {
        return null;
    }

    @Override
    public Page<CityResponse> searchCities(String keyword, Pageable pageable) {
        return null;
    }

    @Override
    public Page<CityResponse> getCityByCountryCode(String countryCode, Pageable pageable) {
        return null;
    }

    @Override
    public boolean cityExists(String cityCode) {
        return false;
    }

    @Override
    public boolean validateCityCode(String cityCode) {
        return false;
    }
}
