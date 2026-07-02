package com.airlink.airline_core_service.Mapper;

import com.airlink.airline_core_service.Model.Aircraft;
import com.airlink.airline_core_service.Model.Airline;
import payload.request.AirLineRequest;
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
                .airlineId(aircraft.getAirline() != null ? aircraft.getAirline().getId() : null)
                .airlineName(aircraft.getAirline() != null ? aircraft.getAirline().getName() : null)
                .airlineIataCode(aircraft.getAirline() != null ? aircraft.getAirline().getIataCode() : null)
                .currentAirportId(aircraft.getCurrentAirportId())
                .totalSeats(aircraft.getTotalSeats())
                .requiresMaintenance(aircraft.getCode())
                .createdAt(aircraft.getCreatedAt())
                .updatedAt(aircraft.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Aircraft aircraft, AircraftRequest request){
        if(aircraft == null || request == null) return;

        aircraft.setCode(request.getCode());
        aircraft.setManufacturer(request.getManufacturer());
        aircraft.setModel(request.getModel());
        aircraft.setSeatingCapacity(request.getSeatingCapacity());
        aircraft.setEconomySeats(request.getEconomySeats());
        aircraft.setPremiumEconomySeats(request.getPremiumEconomySeats());
        aircraft.setBusinessSeats(request.getBusinessSeats());
        aircraft.setFirstClassSeat(request.getFirstClassSeat());
        aircraft.setRangeKm(request.getRangeKm());
        aircraft.setCruisingSpeedKmh(request.getCruisingSpeedKmh());
        aircraft.setMaxAltitudeFt(request.getMaxAltitudeFt());
        aircraft.setYearOfManufacture(request.getYearOfManufacture());
        aircraft.setRegistrationDate(request.getRegistrationDate().atStartOfDay());
        aircraft.setNextMaintenanceDate(request.getNextMaintenanceDate().atStartOfDay());
        aircraft.setStatus(request.getStatus());
        aircraft.setIsAvailable(request.getIsAvailable());
//        aircraft.setAirline(airline);
        aircraft.setCurrentAirportId(request.getCurrentAirportId());
    }
}
