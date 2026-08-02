package com.arilink.seat_service.Mapper;

import com.arilink.seat_service.Model.FlightInstanceCabin;
import com.arilink.seat_service.Model.Seat;
import com.arilink.seat_service.Model.SeatInstance;
import enums.SeatAvailabilityStatus;
import payload.request.SeatInstanceRequest;
import payload.response.SeatInstanceResponse;

public class SeatInstanceMapper {

    public static SeatInstance toEntity(SeatInstanceRequest request, Seat seat,
                                        FlightInstanceCabin flightInstanceCabin) {
        return SeatInstance.builder()
                .flightId(request.getFlightId())
                .seat(seat)
                .flightInstanceCabin(flightInstanceCabin)
                .flightInstanceId(request.getFlightInstanceId())
                .status(request.getStatus() != null ?
                        SeatAvailabilityStatus.valueOf(request.getStatus().toUpperCase()) :
                        SeatAvailabilityStatus.AVAILABLE)
                .mealPreference(request.getMealPreference())
                .fare(request.getFare())
                .build();
    }

    public static SeatInstanceResponse toResponse(SeatInstance si) {
        return SeatInstanceResponse.builder()
                .id(si.getId())
                .flightId(si.getFlightId())
                .seatId(si.getSeat() != null ? si.getSeat().getId() : null)
                .seatNumber(si.getSeat() != null ? si.getSeat().getSeatNumber() : null)
                .seatType(si.getSeat() != null ? si.getSeat().getSeatType().name() : null)
                .seatPosition(si.getSeat() != null ? si.getSeat().getFullPosition() : null)
                .seat(si.getSeat() != null ? SeatMapper.toResponse(si.getSeat()) : null)
                .status(si.getStatus())
                .flightInstanceId(si.getFlightInstanceId())
                .flightCabinId(si.getFlightInstanceCabin() != null ? si.getFlightInstanceCabin().getId() : null)
                .flightCabinClassType(si.getFlightInstanceCabin() != null && si.getFlightInstanceCabin().getCabinClass() != null ? si.getFlightInstanceCabin().getCabinClass().getName() : null)
                .mealPreference(si.getMealPreference())
                .fare(si.getFare())
                .price(si.getPremiumSurcharge())
                .version(si.getVersion())
                .createdAt(si.getCreatedAt())
                .updatedAt(si.getUpdatedAt())
                .isAvailable(si.getIsAvailable())
                .isBooked(si.getIsBooked())
                .isOccupied(si.getStatus() == SeatAvailabilityStatus.OCCUPIED)
//                .seatCharacteristics(
//                        si.getSeat() != null ? buildSeatCharacteristics(si.getSeat()) : null)
                .build();
    }
}
