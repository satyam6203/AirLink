package com.airline.ancillary_service.Mapper;

import com.airline.ancillary_service.Model.Ancillary;
import payload.response.AncillaryResponse;
import payload.response.InsuranceCoverageResponse;

import java.util.List;

public class AncillaryMapper {

    public static AncillaryResponse toResponse(
            Ancillary ancillary,
            List<InsuranceCoverageResponse> coverageResponseList
    ){
        if(ancillary == null) return null;

        return AncillaryResponse.builder()
                .id(ancillary.getId())
                .type(ancillary.getType())
                .subType(ancillary.getSubType())
                .rfisc(ancillary.getRfisc())
                .name(ancillary.getName())
                .description(ancillary.getDescription())
                .metadata(ancillary.getMetadata())
                .coverages(coverageResponseList)
                .displayOrder(ancillary.getDisplayOrder())
                .airlineId(ancillary.getAirlineId())
                .build();
    }
}
