package com.airlink.pricing_service.Repo;

import com.airlink.pricing_service.Model.Fare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FareRepo extends JpaRepository<Fare, Long> {

}
