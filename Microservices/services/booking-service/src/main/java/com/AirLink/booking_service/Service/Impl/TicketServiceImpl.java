package com.AirLink.booking_service.Service.Impl;

import com.AirLink.booking_service.Model.Booking;
import com.AirLink.booking_service.Model.Passenger;
import com.AirLink.booking_service.Model.Ticket;
import com.AirLink.booking_service.Repo.TicketRepo;
import com.AirLink.booking_service.Service.TicketService;
import enums.TicketStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepo ticketRepo;


    @Override
    public List<Ticket> generateTicketsForBooking(Booking booking) {
        List<Ticket> tickets = new ArrayList<Ticket>();

        for(Passenger passenger : booking.getPassengers()){
            String ticketNumber = generateUniqueTicketNumber();

            Ticket ticket = Ticket.builder()
                    .ticketNumber(ticketNumber)
                    .status(TicketStatus.BOOKED)
                    .issuedAt(LocalDateTime.now())
                    .booking(booking)
                    .passenger(passenger)
                    .build();

            Ticket saved = ticketRepo.save(ticket);
            tickets.add(saved);
        }
        return tickets;
    }

    private String generateUniqueTicketNumber() {
        String ticketNumber;
        do {
            String datePart = LocalDateTime.now().toString().substring(0, 10).replace("-", "");
            String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            ticketNumber = String.format("TKT-%s-%s", datePart, randomPart);
        } while (ticketRepo.existsByTicketNumber(ticketNumber));

        return ticketNumber;
    }
}
