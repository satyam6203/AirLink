package com.airlink.pricing_service.Service.Impl;

import com.airlink.pricing_service.Mapper.BaggagePolicyMapper;
import com.airlink.pricing_service.Model.BaggagePolicy;
import com.airlink.pricing_service.Model.Fare;
import com.airlink.pricing_service.Repo.BaggageRepo;
import com.airlink.pricing_service.Repo.FareRepo;
import com.airlink.pricing_service.Service.BaggagePolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.BaggagePolicyRequest;
import payload.response.BaggagePolicyResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaggagePolicyServiceImpl implements BaggagePolicyService {

    private final BaggageRepo baggageRepo;
    private final FareRepo fareRepo;

    @Override
    public BaggagePolicyResponse createBaggagePolicy(BaggagePolicyRequest request) throws Exception {
        Fare fare = fareRepo.findById(request.getFareId()).orElseThrow(
                () -> new Exception("baggage policy not found with this id")
        );
        if(baggageRepo.existsByFareId(fare.getId())){
            throw new Exception("baggage policy already exists");
        }
        BaggagePolicy baggagePolicy = BaggagePolicyMapper.toEntity(request, fare);
        baggageRepo.save(baggagePolicy);
        return BaggagePolicyMapper.toResponse(baggagePolicy);
    }

    @Override
    public BaggagePolicyResponse getBaggagePolicyById(Long id) throws Exception {
        BaggagePolicy baggagePolicy = baggageRepo.findById(id).orElseThrow(
                () -> new Exception("baggage policy not exists by this id")
        );
        return BaggagePolicyMapper.toResponse(baggagePolicy);
    }

    @Override
    public BaggagePolicyResponse getBaggagePolicyByFareId(Long fareId) throws Exception {
        BaggagePolicy baggagePolicy = baggageRepo.findByFareId(fareId);
        if(baggagePolicy == null){
            throw new Exception("baggage policy not found with this fareId");
        }
        return BaggagePolicyMapper.toResponse(baggagePolicy);
    }

    @Override
    public List<BaggagePolicyResponse> getBaggagePoliciesByAirlineId(Long airlineId) {
        return baggageRepo.findByAirlineId(airlineId).stream()
                .map(BaggagePolicyMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BaggagePolicyResponse updateBaggagePolicy(Long id, BaggagePolicyRequest request) throws Exception {
        BaggagePolicy baggagePolicy = baggageRepo.findById(id).orElseThrow(
                () -> new Exception("baggage policy not exists by this id")
        );
        BaggagePolicyMapper.updateEntity(request, baggagePolicy);
        BaggagePolicy saved = baggageRepo.save(baggagePolicy);
        return BaggagePolicyMapper.toResponse(saved);
    }

    @Override
    public void deletedPolicy(Long id) throws Exception {
        BaggagePolicy baggagePolicy = baggageRepo.findById(id).orElseThrow(
                () -> new Exception("baggage policy not exists by this id")
        );
        baggageRepo.delete(baggagePolicy);

    }
}
