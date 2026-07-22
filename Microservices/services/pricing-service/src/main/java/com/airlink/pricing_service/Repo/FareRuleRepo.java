package com.airlink.pricing_service.Repo;

import com.airlink.pricing_service.Model.FareRules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FareRuleRepo extends JpaRepository<FareRules, Long> {

    FareRules findByFareId(Long fareId);
    List<FareRules> findByAirlineId(Long airlineId);
    boolean existByFareId(Long fareId);
}
