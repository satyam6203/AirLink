package com.airlink.pricing_service.Repo;

import com.airlink.pricing_service.Model.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FareRepo extends JpaRepository<Fare, Long> {
    boolean existsByFlightIdAndCabinClassIdAndName(
            Long flightId,
            Long cabinClassId,
            String name
    );
    List<Fare> findByFlightIdInAndCabinClassId(List<Long> flightId, Long cabinClassId);
    Boolean existsByFlightIdAndCabinClassIdAndNameAndIdNot(Long flightId,
                                                          Long cabinClassId,
                                                          String name,
                                                          Long id
    );
    List<Fare> findByFlightIdAndCabinClassId(Long flightId, Long cabinClassId);
}
