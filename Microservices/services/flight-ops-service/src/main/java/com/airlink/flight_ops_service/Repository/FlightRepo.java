package com.airlink.flight_ops_service.Repository;

import com.airlink.flight_ops_service.Model.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlightRepo extends JpaRepository<Flight, Long> {

    @Query("""
        SELECT f FROM Flight f
        WHERE f.airlineId = :airlineId
        AND (:depId IS NULL OR f.departureAirportId = :depId)
        AND (:arrId IS NULL OR f.arrivalAirportId = :arrId)
    """)
    Page<Flight> findByAirlineId(@Param("airlineId") Long airlineId,
            @Param("depId") Long depId,
            @Param("arrId") Long arrId
            , Pageable pageable);

    boolean existsByFlightNumber(String flightNumber);

    boolean existsByFlightNumberAndIdNot(String flightNumber, Long id);

    Optional<Flight> findByAirlineIdAndId(Long airLineId, Long id);
}
