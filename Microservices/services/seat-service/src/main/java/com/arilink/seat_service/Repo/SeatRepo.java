package com.arilink.seat_service.Repo;

import com.arilink.seat_service.Model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepo extends JpaRepository<Seat, Long> {
    boolean existsBySeatMapId(Long seatId);
}
