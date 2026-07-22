package com.airlink.pricing_service.Service.Impl;

import com.airlink.pricing_service.Repo.FareRuleRepo;
import com.airlink.pricing_service.Service.FareRulesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FareRulesRequest;
import payload.response.FareRulesResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FareRulesServiceImpl implements FareRulesService {

    private final FareRuleRepo fareRuleRepo;

    @Override
    public FareRulesResponse createRule(FareRulesRequest request) {
        return null;
    }

    @Override
    public FareRulesResponse getFareRulesById(Long id) {
        return null;
    }

    @Override
    public FareRulesResponse getFareRulesByFareId(Long fareId) {
        return null;
    }

    @Override
    public List<FareRulesResponse> getFareRulesByAirlineId(Long airlineId) {
        return List.of();
    }

    @Override
    public FareRulesResponse updateFareRules(Long id, FareRulesRequest request) {
        return null;
    }

    @Override
    public void deleteFareRules(Long id) {

    }
}
