package com.airlink.pricing_service.Mapper;

import com.airlink.pricing_service.Model.FareRules;
import payload.request.FareRulesRequest;

public class FareRuleMapper {

    public static FareRules toEntity(FareRulesRequest request){
        if(request == null) return null;
        return FareRules.builder()
                
                .build();
    }
}
