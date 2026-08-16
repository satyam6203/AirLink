package com.AirLink.booking_service.Repo;

import com.AirLink.booking_service.Model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepo extends JpaRepository<Ticket, Long> {

    List<Ticket> findByBookingId(Long bookingId);

    @Query("SELECT t FROM Ticket t " +
            "LEFT JOIN FETCH t.booking " +
            "LEFT JOIN FETCH t.passenger " +
            "WHERE t.booking.id = :bookingId")
    List<Ticket> findByBookingIdWithDetails(@Param("bookingId") Long bookingId);
    boolean existsByTicketNumber(String ticketNumber);
}
