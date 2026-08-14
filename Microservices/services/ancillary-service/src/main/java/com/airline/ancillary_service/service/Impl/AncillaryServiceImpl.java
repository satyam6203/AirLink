package com.airline.ancillary_service.service.Impl;

import com.airline.ancillary_service.Mapper.AncillaryMapper;
import com.airline.ancillary_service.Model.Ancillary;
import com.airline.ancillary_service.Repo.AncillaryRepository;
import com.airline.ancillary_service.Repo.InsuranceCoverageRepository;
import com.airline.ancillary_service.service.AncillaryService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import payload.request.AncillaryRequest;
import payload.response.AncillaryResponse;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AncillaryServiceImpl implements AncillaryService {

    private final AncillaryRepository ancillaryRepository;
    private final InsuranceCoverageRepository insuranceCoverageRepository;
//    private final AirlineI

    @Override
    public AncillaryResponse create(Long airlineId, AncillaryRequest request) throws Exception {

        Ancillary ancillary = Ancillary.builder()
                .type(request.getType())
                .subType(request.getSubType())
                .rfisc(request.getRfisc())
                .name(request.getName())
                .description(request.getDescription())
                .metadata(request.getMetadata())
                .displayOrder(request.getDisplayOrder())
                .airlineId(airlineId)
                .build();

        Ancillary saved = ancillaryRepository.save(ancillary);
        return AncillaryMapper.toResponse(saved, null);
    }

    @Override
    public AncillaryResponse getById(Long id) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(id).orElseThrow(
                () -> new Exception("Ancillary not found")
        );
        return AncillaryMapper.toResponse(ancillary, null);
    }

    @Override
    public List<AncillaryResponse> getAllByAirlineId(Long airlineId) {

        return ancillaryRepository.findByAirlineId(airlineId).stream()
                .map(ancillary -> {

                    return  AncillaryMapper.toResponse(ancillary, null);
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
        return AncillaryMapper.toResponse(updated, null);
    }

    @Override
    public void delete(Long id) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(id).orElseThrow(
                () -> new Exception("Ancillary not found")
        );
        ancillaryRepository.delete(ancillary);
    }
}
