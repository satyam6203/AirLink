package com.airlink.airline_core_service.Mapper;

import com.airlink.airline_core_service.Model.Airline;
import embeddable.Support;
import payload.request.AirLineRequest;
import payload.response.AirLineResponse;

public class AirLineMapper {

    public static Airline toEntity(AirLineRequest request, Long ownerId){
        if(request == null) return null;
        Airline airline = Airline.builder()
                .iataCode(request.getIataCode())
                .icaoCode(request.getIcaoCode())
                .name(request.getName())
                .alias(request.getAlias())
                .logoUrl(request.getLogoUrl())
                .website(request.getWebsite())
                .status(request.getStatus())
                .alliance(request.getAlliance())
                .headquarterCityId(request.getHeadquarterCityId())
                .ownerId(ownerId)
                .build();
        if(request.getSupportEmail() != null || request.getSupportPhone() != null
            || request.getSupportHours() != null){
            airline.setSupport(
                    Support.builder()
                            .email(request.getSupportEmail())
                            .phone(request.getSupportPhone())
                            .hours(request.getSupportHours())
                            .build()
            );
        }
        return airline;
    }

    public static AirLineResponse toResponse(Airline airline){
        if(airline == null) return null;

        return AirLineResponse.builder()
                .id(airline.getId())
                .icaoCode(airline.getIcaoCode())
                .iataCode(airline.getIataCode())
                .name(airline.getName())
                .alias(airline.getAlias())
                .logoUrl(airline.getLogoUrl())
                .website(airline.getWebsite())
                .status(airline.getStatus())
                .alliance(airline.getAlliance())
                .support(airline.getSupport())
                .createdAt(airline.getCreatedAt())
                .updatedAt(airline.getUpdatedAt())
                .ownerId(airline.getOwnerId())
                .updatedById(airline.getUpdatedById())
                .build();
    }

    public static void updateEntity(Airline airline, AirLineRequest request){
        if(airline == null || request == null) return;

        airline.setIataCode(request.getIataCode());
        airline.setIcaoCode(request.getIcaoCode());
        airline.setName(request.getName());
        airline.setAlias(request.getAlias());
        airline.setLogoUrl(request.getLogoUrl());
        airline.setWebsite(request.getWebsite());
        airline.setStatus(request.getStatus());
        airline.setAlliance(request.getAlliance());
        airline.setHeadquarterCityId(request.getHeadquarterCityId());

        if(airline.getSupport() == null){
            airline.setSupport(new Support());
        }
        airline.getSupport().setEmail(request.getSupportEmail());
        airline.getSupport().setPhone(request.getSupportPhone());
        airline.getSupport().setHours(request.getSupportHours());
    }
}
