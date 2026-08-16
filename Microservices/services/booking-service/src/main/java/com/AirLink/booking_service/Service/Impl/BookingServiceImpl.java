package com.AirLink.booking_service.Service.Impl;

import com.AirLink.booking_service.Mapper.BookingMapper;
import com.AirLink.booking_service.Model.Booking;
import com.AirLink.booking_service.Model.Passenger;
import com.AirLink.booking_service.Repo.BookingRepo;
import com.AirLink.booking_service.Service.BookingService;
import com.AirLink.booking_service.Service.PassengerService;
import com.AirLink.booking_service.Service.TicketService;
import enums.BookingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import payload.dto.PaymentDTO;
import payload.request.BookingRequest;
import payload.request.PassengerRequest;
import payload.response.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepo bookingRepo;
    private final PassengerService passengerService;
    private final TicketService ticketService;

    @Override
    public BookingResponse createBooking(BookingRequest request, Long userId) throws Exception {

        String bookingReference = generateBookingReference();

        Set<Passenger> passengers = new HashSet<>();
        for(PassengerRequest passengerRequest : request.getPassengers()){
            Passenger passenger = passengerService.createPassenger(passengerRequest, userId);
            passengers.add(passenger);
        }

        Booking booking = BookingMapper.toEntity(request, userId, passengers, bookingReference);
        booking.setAirlineId(1L);

        List<Long> seatInstance = request.getPassengers().stream()
                .map(PassengerRequest :: getSeatInstanceId)
                .toList();

        booking.setSeatInstanceIds(seatInstance);
        booking = bookingRepo.save(booking);

        for(Passenger passenger : passengers){
            passenger.setBooking(booking);
        }

        ticketService.generateTicketsForBooking(booking);
        return convertBookingResponse(booking);
    }

    @Override
    public BookingResponse updateBooking(Long id, BookingRequest request) {
        return null;
    }

    @Override
    public BookingResponse getBookingById(Long id) throws Exception {

        Booking booking =  bookingRepo.findById(id).orElseThrow(
                () -> new Exception("Booking not found with id " + id)
        );

        return convertBookingResponse(booking);
    }

    @Override
    public List<BookingResponse> getAllBookingsByAirline(Long airlineId,
                                                         String searchQuery,
                                                         BookingStatus status,
                                                         Long flightInstanceId,
                                                         String sortDirection) {

        Sort.Direction direction = "acs".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, "bookingDate");

        List<Booking> bookings = bookingRepo.findByAirlineWithFilters(
                airlineId, searchQuery, status, flightInstanceId, sort
        );

        return bookings.stream().map(
            this::convertBookingResponse
        ).toList();
    }

    @Override
    public List<BookingResponse> getBookingByUser(Long userId) {
        return bookingRepo.findByUserId(userId).stream()
                .map(this ::convertBookingResponse)
                .toList();
    }

    @Override
    public BookingResponse cancelBooking(Long id) throws Exception {
        Booking booking =  bookingRepo.findById(id).orElseThrow(
                () -> new Exception("Booking not found with id " + id)
        );

        booking.setStatus(BookingStatus.CANCELLED);
        Booking update = bookingRepo.save(booking);
        return convertBookingResponse(update);
    }

    @Override
    public void deleteBooking(Long id) throws Exception {
        Booking booking =  bookingRepo.findById(id).orElseThrow(
                () -> new Exception("Booking not found with id " + id)
        );
        bookingRepo.delete(booking);
    }

    private String generateBookingReference() {
        String reference;
        do {
            reference = "BK" + UUID.randomUUID().toString()
                    .substring(0, 8).toUpperCase();
        } while (bookingRepo.findByBookingReference(reference).isPresent());
        return reference;
    }

    private BookingResponse convertBookingResponse(Booking booking)  {
        List<FlightCabinAncillaryResponse> ancillaryResponses = new ArrayList<>();
        List<FlightMealResponse> mealResponses = new ArrayList<>();
        PaymentDTO paymentDTO = new PaymentDTO();
        FareResponse fareResponse = new FareResponse();
        FlightResponse flightResponse = new FlightResponse();

        List<SeatInstanceResponse> seatInstanceResponses = new ArrayList<>();
        FlightInstanceResponse flightInstanceResponse = new FlightInstanceResponse();

        System.out.println("seat instances -------- "+seatInstanceResponses.size());

        return BookingMapper.toResponse(booking,
                paymentDTO,
                fareResponse,
                flightResponse,
                flightInstanceResponse,
                ancillaryResponses,
                mealResponses,
                seatInstanceResponses
        );
    }
}
