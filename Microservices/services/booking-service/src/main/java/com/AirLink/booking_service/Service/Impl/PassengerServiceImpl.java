package com.AirLink.booking_service.Service.Impl;

import com.AirLink.booking_service.Mapper.PassengerMapper;
import com.AirLink.booking_service.Model.Passenger;
import com.AirLink.booking_service.Repo.PassengerRepo;
import com.AirLink.booking_service.Service.PassengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.PassengerRequest;
import payload.response.PassengerResponse;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepo passengerRepo;


    @Override
    public Passenger createPassenger(PassengerRequest request, Long userId) {

        Passenger passenger = PassengerMapper.toEntity(request);
        passenger.setPrimaryUserId(userId);
        return passengerRepo.save(passenger);
    }
}
