package com.airline.Mapper;

import com.airline.Model.City;
import lombok.Data;
import payload.request.CityRequest;
import payload.response.CityResponse;


public class CityMapper {
    public static City toEntity(CityRequest req){
        if(req == null) return null;
        return City.builder()
                .name(req.getName())
                .cityCode(req.getCityCode())
                .countryCode(req.getCountryCode())
                .countryName(req.getCountryName())
                .regionCode(req.getRegionCode())
                .timeZone(req.getTimeZoneOffset())
                .build();
    }

    public static CityResponse toResponse(City city){
        if(city == null) return null;
        return CityResponse.builder()
                .id(city.getId())
                .name(city.getName())
                .cityCode(city.getCityCode())
                .countryCode(city.getCountryCode())
                .timeZoneOffset(city.getTimeZone())
                .countryName(city.getCountryName())
                .regionCode(city.getRegionCode())
                .build();

    }

    public static City updateEntity(City city, CityRequest request) {

        if (request.getName() != null) {
            city.setName(request.getName());
        }

        if (request.getCityCode() != null) {
            city.setCityCode(request.getCityCode());
        }
        if (request.getCountryCode() != null) {
            city.setCountryCode(request.getCountryCode());
        }
        if (request.getCountryName() != null) {
            city.setCountryName(request.getCountryName());
        }
        if (request.getRegionCode() != null) {
            city.setRegionCode(request.getRegionCode());
        }
        return city;
    }
}
