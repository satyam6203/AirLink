package com.airline.ancillary_service.Mapper;

import com.airline.ancillary_service.Model.FlightCabinAncillary;
import payload.response.FlightCabinAncillaryResponse;
import payload.response.InsuranceCoverageResponse;

import java.util.List;

public class FlightCabinAncillaryMapper {

    public static FlightCabinAncillaryResponse toResponse(
            FlightCabinAncillary flightCabinAncillary,
            List<InsuranceCoverageResponse> converges
    ){
        if(flightCabinAncillary == null) return null;

        return FlightCabinAncillaryResponse.builder()
                .id(flightCabinAncillary.getId())
                .flightId(flightCabinAncillary.getFlightId())
                .cabinClassId(flightCabinAncillary.getCabinClassId())
                .ancillary(AncillaryMapper.toResponse(flightCabinAncillary.getAncillary(), converges))
                .available(flightCabinAncillary.getAvailable())
                .maxQuantity(flightCabinAncillary.getMaxQuantity())
                .price(flightCabinAncillary.getPrice())
                .currency(flightCabinAncillary.getCurrency())
                .includedInFare(flightCabinAncillary.getIncludedInFare())
                .build();
    }
}
