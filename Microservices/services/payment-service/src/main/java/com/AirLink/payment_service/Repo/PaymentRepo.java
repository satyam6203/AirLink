package com.AirLink.payment_service.Repo;

import com.AirLink.payment_service.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    List<Payment> findByBookingIdIn(List<Long> bookingIds);
}
