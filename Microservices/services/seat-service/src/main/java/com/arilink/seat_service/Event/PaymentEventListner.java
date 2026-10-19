package com.arilink.seat_service.Event;

import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.arilink.seat_service.Client.BookingClient;
import com.arilink.seat_service.Model.SeatInstance;
import com.arilink.seat_service.Service.SeatInstanceService;

import Event.PaymentCompletedEvent;
import enums.SeatAvailabilityStatus;
import lombok.RequiredArgsConstructor;
import payload.response.BookingResponse;
import payload.response.SeatInstanceResponse;

@Service 
@RequiredArgsConstructor 
public class PaymentEventListner {

    private final SeatInstanceService seatInstanceService;
    private final BookingClient bookingClient;

    @KafkaListener(topics = "payment_compelted", groupId = "seat-service-group")
    public void handelPaymentCompeleted(PaymentCompletedEvent event) {
        BookingResponse bookingResponse = bookingClient.getBookingById(event.getBookingId());
        List<SeatInstanceResponse> seatInstances = bookingResponse.getSeatInstances();
        for(SeatInstanceResponse seatInstanceResponse : seatInstances) {
            seatInstanceService.updateSeatInstanceStatus(
                seatInstanceResponse.getId(), 
                SeatAvailabilityStatus.BLOCKED
            );
        }
    }
}
