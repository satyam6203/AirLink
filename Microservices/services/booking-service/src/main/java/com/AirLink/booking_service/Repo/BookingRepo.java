package com.AirLink.booking_service.Repo;

import com.AirLink.booking_service.Model.Booking;
import enums.BookingStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);
    long countByFlightInstanceId(Long flightInstanceId);

    @Query("SELECT DISTINCT b FROM Booking b " +
            "LEFT JOIN FETCH b.passengers p " +
            "WHERE b.airlineId = :airlineId " +
            "AND (:search IS NULL OR " +
            "LOWER(b.bookingReference) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.contactInfo.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(b.contactInfo.phone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:status IS NULL OR b.status = :status) " +
            "AND (:flightInstanceId IS NULL OR b.flightInstanceId = :flightInstanceId)")
    List<Booking> findByAirlineWithFilters(
            @Param("airlineId") Long airlineId,
            @Param("search") String search,
            @Param("status") BookingStatus status,
            @Param("flightInstanceId") Long flightInstanceId,
            Sort sort);
    Optional<Booking> findByBookingReference(String bookingReference);
}
