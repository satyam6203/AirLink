package com.airlink.pricing_service.Repo;

import com.airlink.pricing_service.Model.BaggagePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import payload.response.BaggagePolicyResponse;

import java.util.List;

@Repository
public interface BaggageRepo extends JpaRepository<BaggagePolicy, Long> {
    BaggagePolicy findByFareId(Long fareId);
    List<BaggagePolicy> findByAirlineId(Long airlineId);
    boolean existByFareId(Long fareId);
}
