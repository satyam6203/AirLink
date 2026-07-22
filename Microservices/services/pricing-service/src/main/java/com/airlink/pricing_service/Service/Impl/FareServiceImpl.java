package com.airlink.pricing_service.Service.Impl;

import com.airlink.pricing_service.Mapper.FareMapper;
import com.airlink.pricing_service.Model.Fare;
import com.airlink.pricing_service.Repo.FareRepo;
import com.airlink.pricing_service.Service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FareRequest;
import payload.response.FareResponse;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FareServiceImpl implements FareService {

    private final FareRepo fareRepo;

    @Override
    public FareResponse createFare(FareRequest request) throws Exception {
        if(fareRepo.exitsByFlightIdAndCabinClassAndName(
                request.getFlightId(),
                request.getCabinClassId(),
                request.getName()
        )){
            throw new Exception("fare already exist with provided name");
        }
        Fare fare = FareMapper.toEntity(request);
        Fare save = fareRepo.save(fare);
        return FareMapper.toResponse(save);
    }

    @Override
    public FareResponse getFareById(Long id) throws Exception {
        Fare fare = fareRepo.findById(id).orElseThrow(
                () -> new Exception("Fare not found with this id " + id)
        );
        return FareMapper.toResponse(fare);
    }

    @Override
    public List<FareResponse> getFaresByFlightIdAndCabinClassId(Long flightId, Long cabinClassId) {
        return fareRepo.findByFlightIdAndCabinClassId(
                flightId, cabinClassId
        ).stream().map(
                FareMapper :: toResponse
        ).toList();
    }

    @Override
    public FareResponse updateFare(Long id, FareRequest request) throws Exception {
        Fare fare = fareRepo.findById(id).orElseThrow(
                () -> new Exception("Fare not found with this id " + id)
        );
        if(fareRepo.existByFlightIdAndCabinClassIdAndNameAndIdNot(
                request.getFlightId(),
                request.getCabinClassId(),
                request.getName(),
                fare.getId()
        ));
        FareMapper.updateEntity(request, fare);
        Fare update = fareRepo.save(fare);
        return FareMapper.toResponse(update);
    }

    @Override
    public void deleteFare(Long id) throws Exception {
        Fare fare = fareRepo.findById(id).orElseThrow(
                () -> new Exception("Fare not found with this id " + id)
        );
        fareRepo.delete(fare);
    }

    @Override
    public List<Fare> getFares() {
        return fareRepo.findAll();
    }

    @Override
    public Map<Long, FareResponse> getLowestFarePerFlight(List<Long> flightIds, Long cabinClassId) {
        if(flightIds == null || flightIds.isEmpty()) return Map.of();

        List<Fare> fares = fareRepo.findByFlightIdInAndCabinClassId(
                flightIds, cabinClassId
        );

        Map<Long,FareResponse> result= fares.stream()
                .collect(Collectors.toMap(
                        Fare :: getFlightId,
                        fare -> fare,
                        // merge: keep the fare with the lower total price
                        (existing, candidate) ->
                                candidate.getTotalPrice() < existing.getTotalPrice()
                                        ? candidate : existing
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry :: getKey,
                        e -> FareMapper.toResponse(e.getValue())
                ));
        System.out.println("result: -----------: lowest fare" + result);
        return result;
    }

    @Override
    public Map<Long, FareResponse> getFareByIds(List<Long> ids) {
        List<Fare> fares = fareRepo.findAllById(ids);
        return fares.stream().collect(Collectors.toMap(
                Fare :: getId,
                FareMapper :: toResponse
        ));
    }
}
