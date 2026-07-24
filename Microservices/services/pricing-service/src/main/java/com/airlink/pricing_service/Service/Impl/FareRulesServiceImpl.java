package com.airlink.pricing_service.Service.Impl;

import com.airlink.pricing_service.Mapper.FareRuleMapper;
import com.airlink.pricing_service.Model.Fare;
import com.airlink.pricing_service.Model.FareRules;
import com.airlink.pricing_service.Repo.FareRepo;
import com.airlink.pricing_service.Repo.FareRuleRepo;
import com.airlink.pricing_service.Service.FareRulesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FareRulesRequest;
import payload.response.FareRulesResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FareRulesServiceImpl implements FareRulesService {

    private final FareRuleRepo fareRuleRepo;
    private final FareRepo fareRepo;

    @Override
    public FareRulesResponse createRule(FareRulesRequest request) throws Exception {
        Fare fare = fareRepo.findById(request.getFareId()).orElseThrow(
                () -> new Exception("Fare not found")
        );
        if(fareRuleRepo.existsByFareId(fare.getId())){
            throw new Exception("Fare already exists");
        }
        FareRules fareRules = FareRuleMapper.toEntity(request, fare);
        FareRules saved = fareRuleRepo.save(fareRules);
        return FareRuleMapper.toResponse(saved);
    }

    @Override
    public FareRulesResponse getFareRulesById(Long id) throws Exception {
        FareRules fare = fareRuleRepo.findById(id).orElseThrow(
                () -> new Exception("FareRule is not find with given id " + id)
        );
        return FareRuleMapper.toResponse(fare);
    }

    @Override
    public FareRulesResponse getFareRulesByFareId(Long fareId) throws Exception {
        FareRules fareRules = fareRuleRepo.findByFareId(fareId);
        if(fareRules == null){
            throw new Exception("FareRule not found this is fareRule Id "+ fareId);
        }
        return FareRuleMapper.toResponse(fareRules);
    }

    @Override
    public List<FareRulesResponse> getFareRulesByAirlineId(Long airlineId) {
        return fareRuleRepo.findByAirlineId(airlineId).stream()
                .map(FareRuleMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FareRulesResponse updateFareRules(Long id, FareRulesRequest request) throws Exception {
        FareRules fareRules = fareRuleRepo.findById(id).orElseThrow(
                () -> new Exception("FareRule is not find with given id " + id)
        );
        FareRuleMapper.updateEntity(request, fareRules);
        fareRuleRepo.save(fareRules);
        return FareRuleMapper.toResponse(fareRules);
    }

    @Override
    public void deleteFareRules(Long id) throws Exception {
        FareRules fare = fareRuleRepo.findById(id).orElseThrow(
                () -> new Exception("FareRule is not find with given id " + id)
        );
        fareRuleRepo.delete(fare);
    }
}
