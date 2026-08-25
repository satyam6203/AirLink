package com.airline.ancillary_service.service.Impl;

import com.airline.ancillary_service.Mapper.AncillaryMapper;
import com.airline.ancillary_service.Mapper.InsuranceCoverageMapper;
import com.airline.ancillary_service.Model.Ancillary;
import com.airline.ancillary_service.Model.InsuranceCoverage;
import com.airline.ancillary_service.Repo.AncillaryRepository;
import com.airline.ancillary_service.Repo.InsuranceCoverageRepository;
import com.airline.ancillary_service.client.AirlineClient;
import com.airline.ancillary_service.service.AncillaryService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import payload.request.AncillaryRequest;
import payload.response.AirLineResponse;
import payload.response.AircraftResponse;
import payload.response.AncillaryResponse;
import payload.response.InsuranceCoverageResponse;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AncillaryServiceImpl implements AncillaryService {

    private final AncillaryRepository ancillaryRepository;
    private final InsuranceCoverageRepository insuranceCoverageRepository;
    private final AirlineClient airlineClient;

    @Override
    public AncillaryResponse create(Long userId, AncillaryRequest request) throws Exception {
        AirLineResponse response = airlineClient.getAirLineByOwner(userId);
        Ancillary ancillary = Ancillary.builder()
                .type(request.getType())
                .subType(request.getSubType())
                .rfisc(request.getRfisc())
                .name(request.getName())
                .description(request.getDescription())
                .metadata(request.getMetadata())
                .displayOrder(request.getDisplayOrder())
                .airlineId(response.getOwnerId())
                .build();

        Ancillary saved = ancillaryRepository.save(ancillary);
        return AncillaryMapper.toResponse(saved, null);
    }

    @Override
    public AncillaryResponse getById(Long id) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(id).orElseThrow(
                () -> new Exception("Ancillary not found")
        );
        List<InsuranceCoverage>  insuranceCoverages = insuranceCoverageRepository.findByAncillaryId(ancillary.getId());
        List<InsuranceCoverageResponse> responses = insuranceCoverages.stream()
                .map(InsuranceCoverageMapper :: toResponse)
                .toList();
        return AncillaryMapper.toResponse(ancillary, responses);
    }

    @Override
    public List<AncillaryResponse> getAllByAirlineId(Long userId) {
        AirLineResponse response = airlineClient.getAirLineByOwner(userId);
        return ancillaryRepository.findByAirlineId(userId).stream()
                .map(ancillary -> {
                    List<InsuranceCoverage>  insuranceCoverages = insuranceCoverageRepository.findByAncillaryId(ancillary.getId());
                    List<InsuranceCoverageResponse> responses = insuranceCoverages.stream()
                            .map(InsuranceCoverageMapper :: toResponse)
                            .toList();
                    return  AncillaryMapper.toResponse(ancillary, responses);
                })
                .collect(Collectors.toList());
    }

    @Override
    public AncillaryResponse update(Long id, AncillaryRequest request) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(id).orElseThrow(
                () -> new Exception("Ancillary not found")
        );

        ancillary.setType(request.getType());
        ancillary.setSubType(request.getSubType());
        ancillary.setRfisc(request.getRfisc());
        ancillary.setName(request.getName());
        ancillary.setDescription(request.getDescription());
        ancillary.setMetadata(request.getMetadata());
        ancillary.setDisplayOrder(request.getDisplayOrder());

        Ancillary updated = ancillaryRepository.save(ancillary);
        List<InsuranceCoverage>  insuranceCoverages = insuranceCoverageRepository.findByAncillaryId(ancillary.getId());
        List<InsuranceCoverageResponse> responses = insuranceCoverages.stream()
                .map(InsuranceCoverageMapper :: toResponse)
                .toList();
        return AncillaryMapper.toResponse(updated, responses);
    }

    @Override
    public void delete(Long id) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(id).orElseThrow(
                () -> new Exception("Ancillary not found")
        );
        ancillaryRepository.delete(ancillary);
    }
}
