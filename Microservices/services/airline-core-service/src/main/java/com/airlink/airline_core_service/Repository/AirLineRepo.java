package com.airlink.airline_core_service.Repository;

import com.airlink.airline_core_service.Model.Airline;
import enums.AirLineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirLineRepo extends JpaRepository<Airline, Long> {

    Optional<Airline> findByOwnerId(Long ownerId);
    List<Airline> findByStatus(AirLineStatus status);

}
