package com.AirLink.booking_service.Service;

import com.AirLink.booking_service.Model.Passenger;
import payload.request.PassengerRequest;
import payload.response.PassengerResponse;

public interface PassengerService {

    Passenger createPassenger(PassengerRequest request, Long userId);
}
