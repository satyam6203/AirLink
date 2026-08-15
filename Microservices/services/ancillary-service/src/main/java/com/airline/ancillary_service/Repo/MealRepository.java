package com.airline.ancillary_service.Repo;

import com.airline.ancillary_service.Model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long>, JpaSpecificationExecutor<Meal> {

    List<Meal> findByAirlineId(Long airlineId);

    boolean existsByCodeAndAirlineId(String code, Long airlineId);

    boolean existsByAirlineIdAndCodeAndIdNot(Long airlineId, String code, Long id);
}