package com.airline.ancillary_service.Repo;

import com.airline.ancillary_service.Model.Ancillary;
import com.airline.ancillary_service.Model.InsuranceCoverage;
import enums.CoverageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceCoverageRepository extends JpaRepository<InsuranceCoverage, Long> {

    List<InsuranceCoverage> findByAncillary(Ancillary ancillary);

    List<InsuranceCoverage> findByAncillaryAndActiveTrue(Ancillary ancillary);

    List<InsuranceCoverage> findByCoverageType(CoverageType coverageType);

    List<InsuranceCoverage> findByAncillaryIdAndActiveTrue(Long ancillaryId);
}