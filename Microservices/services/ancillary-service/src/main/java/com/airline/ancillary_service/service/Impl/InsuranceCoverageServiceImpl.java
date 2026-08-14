package com.airline.ancillary_service.service.Impl;

import com.airline.ancillary_service.Mapper.InsuranceCoverageMapper;
import com.airline.ancillary_service.Model.Ancillary;
import com.airline.ancillary_service.Model.InsuranceCoverage;
import com.airline.ancillary_service.Repo.AncillaryRepository;
import com.airline.ancillary_service.Repo.InsuranceCoverageRepository;
import com.airline.ancillary_service.service.InsuranceCoverageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.InsuranceCoverageRequest;
import payload.response.InsuranceCoverageResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsuranceCoverageServiceImpl implements InsuranceCoverageService {

    private final InsuranceCoverageRepository insuranceCoverageRepository;
    private final AncillaryRepository ancillaryRepository;

    @Override
    public InsuranceCoverageResponse createCoverage(InsuranceCoverageRequest request) throws Exception {
        Ancillary ancillary = ancillaryRepository.findById(request.getAncillaryId())
                .orElseThrow(
                        () -> new Exception("ancillary not found with provided id")
                );
        InsuranceCoverage coverage = InsuranceCoverageMapper.toEntity(request, ancillary);

        InsuranceCoverage saved = insuranceCoverageRepository.save(coverage);
        return InsuranceCoverageMapper.toResponse(saved);
    }

    @Override
    public InsuranceCoverageResponse updateCoverage(Long id, InsuranceCoverageRequest request) throws Exception {
        InsuranceCoverage insuranceCoverage = insuranceCoverageRepository.findById(id)
                .orElseThrow(
                    () -> new Exception("insurance coverage not found with id")
                );

        Ancillary ancillary = null;
        if(request.getAncillaryId() != null){
            ancillary = ancillaryRepository.findById(request.getAncillaryId())
                    .orElseThrow(
                            () -> new Exception("ancillary not found with provided id")
                    );
        }

        InsuranceCoverageMapper.updateEntityFromRequest(insuranceCoverage, request, ancillary);
        InsuranceCoverage saved = insuranceCoverageRepository.save(insuranceCoverage);
        return InsuranceCoverageMapper.toResponse(saved);
    }

    @Override
    public void deleteCoverage(Long id) throws Exception {
        InsuranceCoverage insuranceCoverage = insuranceCoverageRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("insurance coverage not found with id")
                );
        insuranceCoverageRepository.delete(insuranceCoverage);
    }

    @Override
    public InsuranceCoverageResponse getCoverageById(Long id) throws Exception {
        InsuranceCoverage insuranceCoverage = insuranceCoverageRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("insurance coverage not found with id")
                );
        return InsuranceCoverageMapper.toResponse(insuranceCoverage);
    }

    @Override
    public List<InsuranceCoverageResponse> getCoveragesByAncillaryId(Long ancillaryId) {
        return insuranceCoverageRepository.findByAncillaryId(ancillaryId)
                .stream()
                .map(InsuranceCoverageMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InsuranceCoverageResponse> getActiveCoveragesByAncillaryId(Long ancillaryId) {
        return insuranceCoverageRepository.findByAncillaryAndActiveTrue(ancillaryId)
                .stream()
                .map(InsuranceCoverageMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InsuranceCoverageResponse> getAllCoverages() {
        return insuranceCoverageRepository.findAll()
                .stream()
                .map(InsuranceCoverageMapper :: toResponse)
                .collect(Collectors.toList());
    }
}
