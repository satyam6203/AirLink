package com.airlink.pricing_service.Service.Impl;

import com.airlink.pricing_service.Model.Fare;
import com.airlink.pricing_service.Repo.FareRepo;
import com.airlink.pricing_service.Service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FareRequest;
import payload.response.FareResponse;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FareServiceImpl implements FareService {

    private final FareRepo fareRepo;

    @Override
    public FareResponse createFare(FareRequest request) {
        return null;
    }

    @Override
    public FareResponse getFareById(Long id) {
        return null;
    }

    @Override
    public List<FareResponse> getFaresByFlightIdAndCabinClassId(Long flightId, Long cabinClassId) {
        return List.of();
    }

    @Override
    public FareResponse updateFare(Long id, FareRequest request) {
        return null;
    }

    @Override
    public void deleteFare(Long id) {

    }

    @Override
    public List<Fare> getFares() {
        return List.of();
    }

    @Override
    public Map<Long, FareResponse> getLowestFarePerFlight(List<Long> flightIds, Long cabinClassId) {
        return Map.of();
    }

    @Override
    public Map<Long, FareResponse> getFareByIds(List<Long> ids) {
        return Map.of();
    }
}
