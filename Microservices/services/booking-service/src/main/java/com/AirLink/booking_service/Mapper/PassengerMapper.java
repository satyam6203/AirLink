package com.AirLink.booking_service.Mapper;

import com.AirLink.booking_service.Model.Passenger;
import payload.request.PassengerRequest;
import payload.response.PassengerResponse;

public class PassengerMapper {

    public static Passenger toEntity(PassengerRequest request) {
        return Passenger.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .nationality(request.getNationality())
                .build();
    }

    public static void updateEntityFromRequest(PassengerRequest request, Passenger passenger) {
        passenger.setFirstName(request.getFirstName());
        passenger.setLastName(request.getLastName());
        passenger.setEmail(request.getEmail());
        passenger.setPhone(request.getPhone());
        passenger.setDateOfBirth(request.getDateOfBirth());
        passenger.setGender(request.getGender());
        passenger.setNationality(request.getNationality());
    }

    public static PassengerResponse toResponse(Passenger passenger) {
        return PassengerResponse.builder()
                .id(passenger.getId())
                .firstName(passenger.getFirstName())
                .lastName(passenger.getLastName())
                .email(passenger.getEmail())
                .phone(passenger.getPhone())
                .dateOfBirth(passenger.getDateOfBirth())
                .gender(passenger.getGender())
                .nationality(passenger.getNationality())
                .isActive(passenger.getIsActive())
                .age(passenger.getAge())
                .isAdult(passenger.isAdult())
                .fullName(passenger.getFullName())
                .createdAt(passenger.getCreatedAt())
                .updatedAt(passenger.getUpdatedAt())
                .build();
    }
}
