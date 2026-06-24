package com.airline.service.impl;

import com.airline.Mapper.CityMapper;
import com.airline.Model.City;
import com.airline.Repo.CityRepo;
import com.airline.service.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import payload.request.CityRequest;
import payload.response.CityResponse;

import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {

    private final CityRepo cityRepo;

    @Override
    public CityResponse createCity(CityRequest req) throws Exception {
        if(cityRepo.existsByCityCode(req.getCityCode())){
            throw new Exception("City with given code already Exists");
        }
        City city = CityMapper.toEntity(req);
        City res = cityRepo.save(city);
        return CityMapper.toResponse(res);
    }

    @Override
    public CityResponse getCityById(Long id) throws Exception {
        City city = cityRepo.findById(id).orElseThrow(
                () -> new Exception("City not found with this id."));
        return CityMapper.toResponse(city);
    }

    @Override
    public CityResponse updateCity(Long id, CityRequest request) throws Exception {
        City city = cityRepo.findById(id).orElseThrow(
                () -> new Exception("City not found with this id."));
        if(cityRepo.existsByCityCode(request.getCityCode())){
            throw  new Exception("city with the given code already exists");
        }
        City update = cityRepo.save(CityMapper.updateEntity(city, request));
        return CityMapper.toResponse(update);
    }

    @Override
    public void deleteCity(Long id) throws Exception {
        City city = cityRepo.findById(id).orElseThrow(
                () -> new Exception("City not found with this id."));
        cityRepo.deleteById(id);
    }

    @Override
    public Page<CityResponse> getAllCities(Pageable pageable) {
        return cityRepo.findAll(pageable).map(CityMapper :: toResponse);
    }

    @Override
    public Page<CityResponse> searchCities(String keyword, Pageable pageable) {
        return cityRepo.searchByKeyword(keyword, pageable).map(CityMapper :: toResponse);
    }

    @Override
    public Page<CityResponse> getCityByCountryCode(String countryCode, Pageable pageable) {
        return cityRepo.findByCountryCodeIgnoreCase(countryCode, pageable).map(CityMapper :: toResponse);
    }

    @Override
    public boolean cityExists(String cityCode) {
        return cityRepo.existsByCityCode(cityCode);
    }


}
