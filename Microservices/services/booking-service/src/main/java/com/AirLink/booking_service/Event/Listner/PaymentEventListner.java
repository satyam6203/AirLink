package com.AirLink.booking_service.Event.Listner;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.AirLink.booking_service.Client.FlightClient;
import com.AirLink.booking_service.Client.UserClient;
import com.AirLink.booking_service.Model.Booking;
import com.AirLink.booking_service.Repo.BookingRepo;

import Event.PaymentCompletedEvent;
import Event.PaymentFiledEvent;
import enums.BookingStatus;
import lombok.RequiredArgsConstructor;
import payload.dto.UserDTO;
import payload.response.FlightInstanceResponse;

@Service 
@RequiredArgsConstructor 
public class PaymentEventListner {

    private final BookingRepo bookingRepo;
    private final FlightClient flightClient;
    private final UserClient userClient;

    @KafkaListener(topics = "payment.compeleted", groupId = "booking-service-group")
    public void hadelPaymentCompelted(PaymentCompletedEvent event) {
        Booking booking = bookingRepo.findById(event.getBookingId()).orElse(null);
        if(booking == null) return;
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepo.save(booking);

        // FlightInstanceResponse flightInstanceResponse = 
        //         flightClient.getFlightInstanceById(booking.getFlightInstanceId());
        
        // UserDTO userDTO = userClient.findUserById(booking.getUserId());
    }

    @KafkaListener(topics = "payment.failed", groupId = "booking-service-group")
    public void handelPaymentFailed(PaymentFiledEvent event) {
        Booking booking = bookingRepo.findById(event.getBookingId()).orElse(null);
        if(booking == null) return;
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);
    }
}
