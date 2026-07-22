package com.airlink.pricing_service.Mapper;

import com.airlink.pricing_service.Model.Fare;
import payload.request.FareRequest;

public class FareMapper {

    public static Fare toEntity(FareRequest request){
        if(request == null) return null;
        return Fare.builder()
                .name(request.getName())
                .rbdCode(request.getRbdCode())
                .flightId(request.getFlightId())
                .cabinClassId(request.getCabinClassId())
                .
                .build();
    }
}
