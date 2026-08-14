package com.airline.ancillary_service.service.Impl;

import com.airline.ancillary_service.Mapper.FlightCabinAncillaryMapper;
import com.airline.ancillary_service.Mapper.InsuranceCoverageMapper;
import com.airline.ancillary_service.Model.Ancillary;
import com.airline.ancillary_service.Model.FlightCabinAncillary;
import com.airline.ancillary_service.Model.InsuranceCoverage;
import com.airline.ancillary_service.Repo.AncillaryRepository;
import com.airline.ancillary_service.Repo.FlightCabinAncillaryRepository;
import com.airline.ancillary_service.Repo.InsuranceCoverageRepository;
import com.airline.ancillary_service.service.FlightCabinAncillaryService;
import enums.AncillaryType;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;
import payload.request.FlightCabinAncillaryRequest;
import payload.response.FlightCabinAncillaryResponse;
import payload.response.InsuranceCoverageResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightCabinAncillaryServiceImpl implements FlightCabinAncillaryService {

    private final FlightCabinAncillaryRepository flightCabinAncillaryRepository;
    private final AncillaryRepository ancillaryRepository;
    private final InsuranceCoverageRepository insuranceCoverageRepository;


    @Override
    public FlightCabinAncillaryResponse create(FlightCabinAncillaryRequest request) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(request.getAncillaryId())
                .orElseThrow(
                        () -> new Exception("ancillary not found")
                );

        FlightCabinAncillary flightCabinAncillary1 = FlightCabinAncillary.builder()
                .flightId(request.getFlightId())
                .cabinClassId(request.getCabinClassId())
                .ancillary(ancillary)
                .maxQuantity(request.getMaxQuantity())
                .available(request.getAvailable())
                .price(request.getPrice())
                .includedInFare(request.getIncludedInFare())
                .build();

        FlightCabinAncillary saved = flightCabinAncillaryRepository.save(flightCabinAncillary1);

        return convertToResponse(saved);
    }

    @Override
    public FlightCabinAncillaryResponse getById(Long id) throws Exception {
        FlightCabinAncillary flightCabinAncillary = flightCabinAncillaryRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("flight cabin ancillary not found")
                );
        return convertToResponse(flightCabinAncillary);
    }

    @Override
    public List<FlightCabinAncillaryResponse> getAllByFlightAndCabinClass(Long flightId, Long cabinClassId) {
        return flightCabinAncillaryRepository.findByFlightIdAndCabinClassId(flightId, cabinClassId)
                .stream()
                .map(this :: convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightCabinAncillaryResponse> getAllByIds(List<Long> ids) {
        return flightCabinAncillaryRepository.findAllById(ids)
                .stream()
                .map(this :: convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FlightCabinAncillaryResponse getByFlightIdAndCabinClassAndType(Long flightId, Long cabinClassId, AncillaryType type) throws Exception {
        FlightCabinAncillary flightCabinAncillary = flightCabinAncillaryRepository
                .findByFlightIdAndCabinClassIdAndAncillary_Type(flightId, cabinClassId, type);

        return convertToResponse(flightCabinAncillary);
    }

    @Override
    public List<FlightCabinAncillaryResponse> getAllByFlightIdAndCabinClassAndType(Long flightId, Long cabinClassId, AncillaryType type) throws Exception {
        return flightCabinAncillaryRepository.findAllByFlightIdAndCabinClassIdAndAncillary_Type(
                flightId, cabinClassId, type)
                .stream()
                .map(this :: convertToResponse)
                .toList();
    }

    @Override
    public FlightCabinAncillaryResponse update(Long id, FlightCabinAncillaryRequest request) throws Exception {
        FlightCabinAncillary flightCabinAncillary = flightCabinAncillaryRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("flight cabin ancillary not found")
                );

        flightCabinAncillary.setAvailable(request.getAvailable());
        flightCabinAncillary.setMaxQuantity(request.getMaxQuantity());
        flightCabinAncillary.setPrice(request.getPrice());
        flightCabinAncillary.setIncludedInFare(request.getIncludedInFare());

        FlightCabinAncillary saved = flightCabinAncillaryRepository.save(flightCabinAncillary);
        return convertToResponse(saved);
    }

    @Override
    public void delete(Long id) throws Exception {
        FlightCabinAncillary flightCabinAncillary = flightCabinAncillaryRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("flight cabin ancillary not found")
                );

        flightCabinAncillaryRepository.delete(flightCabinAncillary);
    }

    @Override
    public Double calculateAncillaryPrice(List<Long> ancillaryIds) {
        List<FlightCabinAncillary> ancillaries = flightCabinAncillaryRepository.findAllById(ancillaryIds);
        double totalPrice = 0;
        for(FlightCabinAncillary ancillary : ancillaries){
            totalPrice += ancillary.getPrice();
        }
        return totalPrice;
    }

    private FlightCabinAncillaryResponse convertToResponse(
            FlightCabinAncillary entity) {
        List<InsuranceCoverage> coverages = insuranceCoverageRepository
                .findByAncillaryId(entity.getId());
        List<InsuranceCoverageResponse> coverageResponses = coverages.stream()
                .map(InsuranceCoverageMapper::toResponse)
                .toList();
        return FlightCabinAncillaryMapper.toResponse(entity, coverageResponses);
    }
}
