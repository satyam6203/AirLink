package com.airline.Repo;

import com.airline.Model.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import payload.response.AirportResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportRepo extends JpaRepository<Airport, Long> {

    Optional<Airport> findByIataCode(String iataCode);

    List<Airport> findByCityId(Long cityId);
}
