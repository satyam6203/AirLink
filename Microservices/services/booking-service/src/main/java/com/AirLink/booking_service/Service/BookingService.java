package com.AirLink.booking_service.Service;

import enums.BookingStatus;
import payload.request.BookingRequest;
import payload.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, Long userId) throws Exception;
    BookingResponse updateBooking(Long id, BookingRequest request);
    BookingResponse getBookingById(Long id) throws Exception;
    List<BookingResponse> getAllBookingsByAirline(Long airlineId,
                                                  String searchQuery,
                                                  BookingStatus status,
                                                  Long flightInstanceId,
                                                  String sortDirection
    );
    List<BookingResponse> getBookingByUser(Long UserId);
    BookingResponse cancelBooking(Long id) throws Exception;
    void deleteBooking(Long id) throws Exception;
}
