package com.airlink.airline_core_service.Repository;

import com.airlink.airline_core_service.Model.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import payload.response.AircraftResponse;

import java.util.List;

@Repository
public interface AircraftRepo extends JpaRepository<Aircraft, Long> {

    List<Aircraft> findByAirlineId(Long airlineId);
    boolean existsByCode(String code);
    Aircraft findByIdAndAirlineId(Long id, Long airlineId);

}
