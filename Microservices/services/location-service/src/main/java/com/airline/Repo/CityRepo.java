package com.airline.Repo;

import com.airline.Model.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepo extends JpaRepository<City,Long> {

    boolean exitsByCityCode(String cityCode);
    boolean existsByCityCodeAndIdNot(String cityCode, Long id);

    Page<City> findByCountryCodeIgnoreCase(String countryCode, Pageable pageable);

    
}
