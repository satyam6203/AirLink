package com.arilink.seat_service.Repo;

import com.arilink.seat_service.Model.SeatInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatInstanceRepo extends JpaRepository<SeatInstance, Long> {

}
