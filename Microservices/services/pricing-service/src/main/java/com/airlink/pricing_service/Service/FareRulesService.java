package com.airlink.pricing_service.Service;

import com.airlink.pricing_service.Model.FareRules;
import payload.request.FareRulesRequest;
import payload.response.FareRulesResponse;

import java.util.List;

public interface FareRulesService {

    FareRulesResponse createRule(FareRulesRequest request) throws Exception;
    FareRulesResponse getFareRulesById(Long id) throws Exception;
    FareRulesResponse getFareRulesByFareId(Long fareId) throws Exception;
    List<FareRulesResponse> getFareRulesByAirlineId(Long airlineId);
    FareRulesResponse updateFareRules(Long id, FareRulesRequest request) throws Exception;
    void deleteFareRules(Long id) throws Exception;

}
