package com.airline.Mapper;

import com.airline.Model.Airport;
import com.airline.Model.City;
import payload.request.AirportRequest;
import payload.request.CityRequest;
import payload.response.AirportResponse;

public class AirPortMapper {

    public static Airport toEntity(AirportRequest request){
        if(request == null) return null;
        return Airport.builder()
                .iataCode(request.getIataCode())
                .name(request.getName())
//                .timeZone(request.getIataCode())
                .address(request.getAddress())
                .geoCode(request.getGeoCode())
                .build();
    }

    public static AirportResponse toResponse(Airport airport){
        if(airport == null) return null;
        return AirportResponse.builder()
                .id(airport.getId())
                .iataCode(airport.getIataCode())
                .name(airport.getIataCode())
                .detailedName(airport.getDetailedName())
                .address(airport.getAddress())
                .city(CityMapper.toResponse(airport.getCity()))
                .geoCode(airport.getGeoCode())
                .build();
    }

    public static  void updateEntity(AirportRequest request, Airport existingAirport) {

        if (request == null) {
            return;
        }

        if (request.getIataCode() != null) {
            existingAirport.setIataCode(request.getIataCode());
        }
        if (request.getName() != null) {
            existingAirport.setName(request.getName());
        }
        if (request.getAddress() != null) {
            existingAirport.setAddress(request.getAddress());
        }
        if(request.getGeoCode() != null){
            existingAirport.setGeoCode(request.getGeoCode());
        }
    }
}
