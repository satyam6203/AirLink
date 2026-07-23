package com.airlink.pricing_service.Service;

import com.airlink.pricing_service.Model.BaggagePolicy;
import payload.request.BaggagePolicyRequest;
import payload.response.BaggagePolicyResponse;

import java.util.List;

public interface BaggagePolicyService {

    BaggagePolicyResponse createBaggagePolicy(BaggagePolicyRequest request) throws Exception;
    BaggagePolicyResponse getBaggagePolicyById(Long id) throws Exception;
    BaggagePolicyResponse getBaggagePolicyByFareId(Long fareId) throws Exception;
    List<BaggagePolicyResponse> getBaggagePoliciesByAirlineId(Long AirlineId);
    BaggagePolicyResponse updateBaggagePolicy(Long id, BaggagePolicyRequest request) throws Exception;
    void deletedPolicy(Long id) throws Exception;
}
