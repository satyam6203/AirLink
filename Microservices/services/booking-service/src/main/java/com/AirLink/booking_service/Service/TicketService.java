package com.AirLink.booking_service.Service;

import com.AirLink.booking_service.Model.Booking;
import com.AirLink.booking_service.Model.Ticket;

import java.util.List;

public interface TicketService {
    List<Ticket> generateTicketsForBooking(Booking booking);
}
