package com.airlink.pricing_service.Service;

import com.airlink.pricing_service.Model.Fare;
import payload.request.FareRequest;
import payload.response.FareResponse;

import java.util.List;
import java.util.Map;

public interface FareService {

    FareResponse createFare(FareRequest request);
    FareResponse getFareById(Long id);
    List<FareResponse> getFaresByFlightIdAndCabinClassId(
            Long flightId,
            Long cabinClassId
    );
    FareResponse updateFare(Long id, FareRequest request);
    void deleteFare(Long id);
    List<Fare> getFares();

    Map<Long, FareResponse> getLowestFarePerFlight(
            List<Long> flightIds,
            Long cabinClassId
    );
    Map<Long, FareResponse> getFareByIds(List<Long> ids);
}
