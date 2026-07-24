package com.arilink.seat_service.Repo;

import com.arilink.seat_service.Model.CabinClass;
import enums.CabinClassType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabinClassRepo extends JpaRepository<CabinClass, Long> {

    List<CabinClass> findByAircraftId(Long aircraftId);
    CabinClass findByAircraftIdAndName(Long aircraftId, CabinClassType name);
    boolean existsByCodeAndAircraftId(String code, Long aircraftId);
    boolean existsByCodeAndAircraftIdAndIdNot(String code, Long aircraftId, Long id);

}
