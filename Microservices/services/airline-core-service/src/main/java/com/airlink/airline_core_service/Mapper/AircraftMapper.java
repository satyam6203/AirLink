package com.airlink.airline_core_service.Mapper;

import com.airlink.airline_core_service.Model.Aircraft;
import com.airlink.airline_core_service.Model.Airline;
import payload.request.AircraftRequest;
import payload.response.AircraftResponse;

public class AircraftMapper {

    public static Aircraft toEntity(AircraftRequest request, Airline airline){
        if(request ==  null){
            return null;
        }

        return Aircraft.builder()
                .code(request.getCode())
                .model(request.getModel())
                .manufacturer(request.getManufacturer())
                .seatingCapacity(request.getSeatingCapacity())
                .economySeats(request.getEconomySeats())
                .premiumEconomySeats(request.getPremiumEconomySeats())
                .businessSeats(request.getBusinessSeats())
                .firstClassSeat(request.getFirstClassSeat())
                .rangeKm(request.getRangeKm())
                .cruisingSpeedKmh(request.getCruisingSpeedKmh())
                .manufacturer(request.getManufacturer())
                .yearOfManufacture(request.getYearOfManufacture())
                .registrationDate(request.getRegistrationDate().atStartOfDay())
                .nextMaintenanceDate(request.getNextMaintenanceDate().atStartOfDay())
                .status(request.getStatus())
                .isAvailable(request.getIsAvailable())
                .airline(airline)
                .currentAirportId(request.getCurrentAirportId())
                .build();
    }

    public static AircraftResponse toResponse(Aircraft aircraft){
        if(aircraft == null) return null;

        return AircraftResponse.builder()
                .id(aircraft.getId())
                .code(aircraft.getCode())
                .model(aircraft.getModel())
                .manufacturer(aircraft.getManufacturer())
                .seatingCapacity(aircraft.getSeatingCapacity())
                .economySeats(aircraft.getEconomySeats())
                .premiumEconomySeats(aircraft.getPremiumEconomySeats())
                .businessSeats(aircraft.getBusinessSeats())
                .firstClassSeat(aircraft.getFirstClassSeat())
                .rangeKm(aircraft.getRangeKm())
                .cruisingSpeedKmh(aircraft.getCruisingSpeedKmh())
                .manufacturer(aircraft.getManufacturer())
                .yearOfManufacture(aircraft.getYearOfManufacture())
                .registrationDate(aircraft.getRegistrationDate())
                .nextMaintenanceDate(aircraft.getNextMaintenanceDate())
                .status(aircraft.getStatus())
                .isAvailable(aircraft.getIsAvailable())
                .airline(aircraft)
                .currentAirportId(aircraft.getCurrentAirportId())
                .build();
    }
}
