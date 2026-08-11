package com.airline.ancillary_service.Repo;

import com.airline.ancillary_service.Model.FlightCabinAncillary;
import enums.AncillaryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightCabinAncillaryRepository extends JpaRepository<FlightCabinAncillary, Long> {

    List<FlightCabinAncillary> findByFlightId(Long flightId);

    List<FlightCabinAncillary> findByFlightIdAndCabinClassId(Long flightId, Long cabinClassId);

    List<FlightCabinAncillary> findByCabinClassId(Long cabinClassId);

    Optional<FlightCabinAncillary> findByFlightIdAndCabinClassIdAndAncillary_Type(
            Long flightId, Long cabinClassId, AncillaryType type);

    List<FlightCabinAncillary> findAllByFlightIdAndCabinClassIdAndAncillary_Type(
            Long flightId, Long cabinClassId, AncillaryType type);
}
