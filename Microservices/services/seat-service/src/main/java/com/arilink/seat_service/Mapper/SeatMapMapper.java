package com.arilink.seat_service.Mapper;

import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Model.SeatMap;
import payload.request.SeatMapRequest;
import payload.response.SeatMapResponse;

public class SeatMapMapper {

    public static SeatMap toEntity(SeatMapRequest request, CabinClass cabinClass){
        if(request == null) return null;

        return SeatMap.builder()
                .name(request.getName())
                .totalRows(request.getTotalRows())
                .leftSeatsPerRow(request.getLeftSeatsPerRow())
                .rightSeatsPerRow(request.getRightSeatsPerRow())
                .cabinClass(cabinClass)
                .build();
    }

    public static SeatMapResponse toResponse(SeatMap seatMap){
        return SeatMapResponse.builder()
                .id(seatMap.getId())
                .name(seatMap.getName())
                .totalRows(seatMap.getTotalRows())
                .leftSeatsPerRow(seatMap.getLeftSeatsPerRow())
                .rightSeatsPerRow(seatMap.getRightSeatsPerRow())
                .airlineId(seatMap.getAirlineId())
                .cabinClassId(seatMap.getCabinClass() != null ? seatMap.getCabinClass().getId() : null)
                .cabinClassName(seatMap.getCabinClass() != null ? seatMap.getCabinClass().getName().toString() : null)
                .cabinClassCode(seatMap.getCabinClass() != null ? seatMap.getCabinClass().getCode() : null)
//                .totalSeats(totalSeats)
//                .availableSeats(availableSeats)
//                .occupiedSeats(totalSeats - availableSeats)
//                .seats(seats != null ? seats.stream().map(SeatMapper::toResponse)
//                        .collect(Collectors.toList()) : null)
//                .windowSeats(windowSeats)
//                .aisleSeats(aisleSeats)
//                .middleSeats(middleSeats)
//                .premiumSeats(premiumSeats)
//                .emergencyExitSeats(emergencyExitSeats)
                .build();
    }

    public static void updateEntity(SeatMapRequest request,
                                    SeatMap seatMap
    ){
        seatMap.setName(request.getName());
        seatMap.setTotalRows(request.getTotalRows());
        seatMap.setLeftSeatsPerRow(request.getLeftSeatsPerRow());
        seatMap.setRightSeatsPerRow(request.getRightSeatsPerRow());
    }

    public static SeatMapResponse toSimpleResponse(SeatMap seatMap) {
        return SeatMapResponse.builder()
                .totalRows(seatMap.getTotalRows())
                .leftSeatsPerRow(seatMap.getLeftSeatsPerRow())
                .rightSeatsPerRow(seatMap.getRightSeatsPerRow())
                .build();
    }
}
