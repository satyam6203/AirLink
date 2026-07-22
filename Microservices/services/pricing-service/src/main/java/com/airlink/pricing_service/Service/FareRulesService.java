package com.airlink.pricing_service.Service;

import com.airlink.pricing_service.Model.FareRules;
import payload.request.FareRulesRequest;
import payload.response.FareRulesResponse;

import java.util.List;

public interface FareRulesService {

    FareRulesResponse createRule(FareRulesRequest request);
    FareRulesResponse getFareRulesById(Long id);
    FareRulesResponse getFareRulesByFareId(Long fareId);
    List<FareRulesResponse> getFareRulesByAirlineId(Long airlineId);
    FareRulesResponse updateFareRules(Long id, FareRulesRequest request);
    void deleteFareRules(Long id);

}
