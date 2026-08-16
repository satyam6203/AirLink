package com.AirLink.booking_service.Repo;

import com.AirLink.booking_service.Model.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PassengerRepo extends JpaRepository<Passenger, Long> {

}
