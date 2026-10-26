package com.AirLink.booking_service.Service.Impl;

import com.AirLink.booking_service.Client.*;
import com.AirLink.booking_service.Integration.PricingIntegrationService;
import com.AirLink.booking_service.Mapper.BookingMapper;
import com.AirLink.booking_service.Model.Booking;
import com.AirLink.booking_service.Model.Passenger;
import com.AirLink.booking_service.Repo.BookingRepo;
import com.AirLink.booking_service.Repo.PassengerRepo;
import com.AirLink.booking_service.Service.BookingService;
import com.AirLink.booking_service.Service.PassengerService;
import com.AirLink.booking_service.Service.TicketService;
import enums.BookingStatus;
import enums.PaymentGateway;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import payload.dto.PaymentDTO;
import payload.request.BookingRequest;
import payload.request.PassengerRequest;
import payload.request.PaymentInitiateRequest;
import payload.response.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepo bookingRepo;
    private final PassengerRepo passengerRepo;
    private final PassengerService passengerService;
    private final TicketService ticketService;
    private final AncillaryClient ancillaryClient;
    private final PaymentClient paymentClient;
    private final SeatClient seatClient;
    private final PricingIntegrationService pricingIntegrationService;
    private final FlightClient flightClient;
    private final AirlineClient airlineClient;

    @Override
    @Transactional
    public PaymentInitiateResponse createBooking(BookingRequest request, Long userId) throws Exception {

        String bookingReference = generateBookingReference();

        Set<Passenger> passengers = new HashSet<>();
        if (request.getPassengers() != null) {
            for(PassengerRequest passengerRequest : request.getPassengers()){
                Passenger passenger = passengerService.createPassenger(passengerRequest, userId);
                passengers.add(passenger);
            }
        }

        FlightResponse flightResponse = null;
        try {
            flightResponse = flightClient.getFlightById(request.getFlightId());
        } catch (Exception e) {
            log.error("Failed to fetch flight with id {}: {}", request.getFlightId(), e.getMessage());
        }

        Booking booking = BookingMapper.toEntity(request, userId, passengers, bookingReference);
        if (flightResponse != null && flightResponse.getAirline() != null && flightResponse.getAirline().getId() != null) {
            booking.setAirlineId(flightResponse.getAirline().getId());
        } else {
            booking.setAirlineId(1L);
        }

        List<Long> seatInstance = (request.getPassengers() != null)
                ? request.getPassengers().stream()
                        .map(PassengerRequest::getSeatInstanceId)
                        .filter(Objects::nonNull)
                        .toList()
                : Collections.emptyList();

        booking.setSeatInstanceIds(seatInstance);
        booking = bookingRepo.save(booking);

        for(Passenger passenger : passengers){
            passenger.setBooking(booking);
        }
        passengerRepo.saveAll(passengers);

        ticketService.generateTicketsForBooking(booking);

        Double fareTotal = 0.0;
        if (request.getFareId() != null) {
            try {
                fareTotal = pricingIntegrationService.calculateFareTotal(request.getFareId());
            } catch (Exception e) {
                log.error("Failed to calculate fare total for fareId {}: {}", request.getFareId(), e.getMessage());
            }
        }
        if (fareTotal == null) {
            fareTotal = 0.0;
        }

        int passengerCount = (request.getPassengers() != null && !request.getPassengers().isEmpty())
                ? request.getPassengers().size() : 1;
        fareTotal = fareTotal * passengerCount;

        Double seatPrice = 0.0;
        if (booking.getSeatInstanceIds() != null && !booking.getSeatInstanceIds().isEmpty()) {
            try {
                seatPrice = seatClient.calculateSeatPrice(booking.getSeatInstanceIds());
            } catch (Exception e) {
                log.error("Failed to calculate seat price: {}", e.getMessage());
            }
        }
        if (seatPrice == null) {
            seatPrice = 0.0;
        }

        Double ancillaryPrice = 0.0;
        if (booking.getAncillaryIds() != null && !booking.getAncillaryIds().isEmpty()) {
            try {
                ancillaryPrice = ancillaryClient.calculateAncillariesPrice(booking.getAncillaryIds());
            } catch (Exception e) {
                log.error("Failed to calculate ancillary price: {}", e.getMessage());
            }
        }
        if (ancillaryPrice == null) {
            ancillaryPrice = 0.0;
        }

        Double mealPrice = 0.0;
        if (booking.getMealIds() != null && !booking.getMealIds().isEmpty()) {
            try {
                mealPrice = ancillaryClient.calculateMealPrice(booking.getMealIds());
            } catch (Exception e) {
                log.error("Failed to calculate meal price: {}", e.getMessage());
            }
        }
        if (mealPrice == null) {
            mealPrice = 0.0;
        }

        Double total = fareTotal + seatPrice + ancillaryPrice + mealPrice;
        if (total <= 0.0) {
            total = 100.0;
        }

        PaymentInitiateRequest request1 = PaymentInitiateRequest.builder()
                .userId(userId)
                .bookingId(booking.getId())
                .gateway(PaymentGateway.RAZORPAY)
                .amount(total)
                .description("payment booking for " + booking.getId())
                .build();

        return paymentClient.initiatePayment(request1);
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
    public List<BookingResponse> getAllBookingsByAirline(Long userId,
                                                         String searchQuery,
                                                         BookingStatus status,
                                                         Long flightInstanceId,
                                                         String sortDirection) {
        AirLineResponse response = airlineClient.getAirLineByOwner(userId);

        Sort.Direction direction = "acs".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, "bookingDate");

        List<Booking> bookings = bookingRepo.findByAirlineWithFilters(
                response.getId(), searchQuery, status, flightInstanceId, sort
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
