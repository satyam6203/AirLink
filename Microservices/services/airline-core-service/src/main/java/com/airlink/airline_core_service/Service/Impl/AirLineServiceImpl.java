package com.airlink.airline_core_service.Service.Impl;

import com.airlink.airline_core_service.Mapper.AirLineMapper;
import com.airlink.airline_core_service.Model.Airline;
import com.airlink.airline_core_service.Repository.AirLineRepo;
import com.airlink.airline_core_service.Service.AirLineService;
import enums.AirLineStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import payload.request.AirLineRequest;
import payload.response.AirLineDropdownItem;
import payload.response.AirLineResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AirLineServiceImpl implements AirLineService {

    private final AirLineRepo airLineRepo;

    @Override
    public AirLineResponse createAirLine(AirLineRequest request, Long ownerId) {
        Airline airline = AirLineMapper.toEntity(request, ownerId);
        Airline savedAirLine = airLineRepo.save(airline);
        return AirLineMapper.toResponse(savedAirLine);
    }

    @Override
    public AirLineResponse getAirLineByOwner(Long ownerId) throws Exception {
        Airline airline = airLineRepo.findByOwnerId(ownerId)
                .orElseThrow(
                        () -> new Exception("AirLine not found with this id " + ownerId)
                );
        return AirLineMapper.toResponse(airline);
    }

    @Override
    public AirLineResponse getAirLineById(Long id) throws Exception {
        Airline airline = airLineRepo.findById(id)
                .orElseThrow(
                        () -> new Exception("AirLine not found with this id " + id)
                );
        return AirLineMapper.toResponse(airline);
    }

    @Override
    public AirLineResponse updateAirLine(AirLineRequest request, Long ownerId) throws Exception {
        Airline airline = airLineRepo.findByOwnerId(ownerId)
                .orElseThrow(
                        () -> new Exception("AirLine not found with this id " + ownerId)
                );
        AirLineMapper.updateEntity(airline, request);
        Airline airline1 = airLineRepo.save(airline);
        return AirLineMapper.toResponse(airline);
    }

    @Override
    public Page<AirLineResponse> getAllAirLines(Pageable pageable) {
        return airLineRepo.findAll(pageable).map(
                AirLineMapper :: toResponse
        );
    }

    @Override
    public void deleteAirLine(Long id, Long ownerId) throws Exception {
        Airline airline = airLineRepo.findByOwnerId(ownerId)
                .orElseThrow(() -> new Exception("AirLine not found with this id " + ownerId));
        airLineRepo.delete(airline);
    }

    @Override
    public AirLineResponse changeStatus(Long airLineId, AirLineStatus status) throws Exception {
        Airline airline = airLineRepo.findById(airLineId)
                .orElseThrow(
                        () -> new Exception("AirLine not found with this id " + airLineId)
                );
        airline.setStatus(status);
        Airline updatedAirLine = airLineRepo.save(airline);
        return AirLineMapper.toResponse(updatedAirLine);
    }

    @Override
    public List<AirLineDropdownItem> getAirLineDropDown() {
        return airLineRepo.findByStatus(AirLineStatus.ACTIVE)
                .stream()
                .map(a -> AirLineDropdownItem.builder()
                        .id(a.getId())
                        .iataCode(a.getIataCode())
                        .name(a.getName())
                        .icaoCode(a.getIcaoCode())
                        .logoUrl(a.getLogoUrl())
                        .build()).toList();
    }
}
