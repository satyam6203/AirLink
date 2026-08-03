package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Mapper.FlightInstanceCabinMapper;
import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Model.FlightInstanceCabin;
import com.arilink.seat_service.Model.SeatInstance;
import com.arilink.seat_service.Model.SeatMap;
import com.arilink.seat_service.Repo.CabinClassRepo;
import com.arilink.seat_service.Repo.FlightInstanceCabinRepo;
import com.arilink.seat_service.Repo.SeatInstanceRepo;
import com.arilink.seat_service.Repo.SeatMapRepo;
import com.arilink.seat_service.Service.FlightInstanceService;
import enums.SeatAvailabilityStatus;
import enums.SeatType;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import payload.request.FlightInstanceCabinRequest;
import payload.response.FlightInstanceCabinResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightInstanceCabinServiceImpl implements FlightInstanceService {

    private final FlightInstanceCabinRepo flightInstanceCabinRepo;
    private final CabinClassRepo cabinClassRepo;
    private final SeatMapRepo seatMapRepo;
    private final SeatInstanceRepo seatInstanceRepo;

    @Override
    public FlightInstanceCabinResponse createFlightInstanceCabin(FlightInstanceCabinRequest request) throws Exception {

        CabinClass cabinClass = cabinClassRepo.findById(request.getCabinClassId())
                .orElseThrow(
                        () -> new Exception("Cabin class not found")
                );

        SeatMap seatMap = seatMapRepo.findByCabinClassId(cabinClass.getId());

        if(seatMap == null){
            throw new Exception("Seat Map not found");
        }

        if(seatMap.getSeats() == null || seatMap.getSeats().isEmpty()){
            throw new Exception("no seats found in seat map");
        }

        int totalSeats = seatMap.getSeats().size();

        FlightInstanceCabin cabin = FlightInstanceCabin.builder()
                .flightInstanceId(request.getFlightInstanceId())
                .cabinClass(cabinClass)
                .totalSeats(totalSeats)
                .bookedSeats(0)
                .build();

        FlightInstanceCabin flightInstanceCabin = flightInstanceCabinRepo.save(cabin);

        List<SeatInstance> seatInstances = seatMap.getSeats().stream()
                .map(
                        seat -> {
                            Double premiumSuperCharge = getPremiumSuperCharge(
                                    seat.getSeatType(),
                                    request.getWindowSurcharge(),
                                    request.getAisleSurcharge()
                            );
                            SeatInstance seatInstance = SeatInstance.builder()
                                    .flightId(request.getFlightId())
                                    .status(SeatAvailabilityStatus.AVAILABLE)
                                    .flightInstanceId(request.getFlightInstanceId())
                                    .flightInstanceCabin(flightInstanceCabin)
                                    .seat(seat)
                                    .isAvailable(true)
                                    .isBooked(false)
                                    .premiumSurcharge(premiumSuperCharge)
                                    .build();
                            return seatInstance;
                        }
                ).toList();

        seatInstanceRepo.saveAll(seatInstances);
        flightInstanceCabin.setSeats(seatInstances);
        return FlightInstanceCabinMapper.toResponse(flightInstanceCabin);
    }

    @Override
    public FlightInstanceCabinResponse getFlightInstanceCabinById(Long id) throws Exception {
        FlightInstanceCabin flightInstanceCabin = flightInstanceCabinRepo.findById(id)
                .orElseThrow(
                        () -> new Exception("flight instance not found with this id")
                );
        return FlightInstanceCabinMapper.toResponse(flightInstanceCabin);
    }

    @Override
    public Page<FlightInstanceCabinResponse> getByFlightInstanceId(Long id, Pageable pageable) {
        return flightInstanceCabinRepo.findByFlightInstanceId(id, pageable)
                .map(FlightInstanceCabinMapper :: toResponse);
    }

    @Override
    public FlightInstanceCabinResponse getByFlightInstanceIdAndCabinClassId(Long id, Long cabinClassId) {
        FlightInstanceCabin cabin = flightInstanceCabinRepo.findByFlightInstanceIdAndCabinClassId(
                id,
                cabinClassId
        );
        return FlightInstanceCabinMapper.toResponse(cabin);
    }

    @Override
    public FlightInstanceCabinResponse updateFlightInstanceCabin(Long id, FlightInstanceCabinRequest request) throws Exception {
        FlightInstanceCabin flightInstanceCabin = flightInstanceCabinRepo.findById(id)
                .orElseThrow(
                        () -> new Exception("flight instance not found with this id")
                );

        if(request != null){
            CabinClass cabinClass = cabinClassRepo.findById(request.getCabinClassId()).orElseThrow(
                    () -> new EntityNotFoundException("Cabin class not found")
            );
            flightInstanceCabin.setCabinClass(cabinClass);
        }
        FlightInstanceCabin updated = flightInstanceCabinRepo.save(flightInstanceCabin);
        return FlightInstanceCabinMapper.toResponse(updated);
    }

    @Override
    public void deleteFlightInstanceCabin(Long id) throws Exception {
        FlightInstanceCabin flightInstanceCabin = flightInstanceCabinRepo.findById(id)
                .orElseThrow(
                        () -> new Exception("flight instance not found with this id")
                );
        flightInstanceCabinRepo.delete(flightInstanceCabin);
    }

    private Double getPremiumSuperCharge(SeatType seatType,
                                         Double windowSuperCharge,
                                         Double aisleSuperCharge){
        if(seatType == null) return 0.0;
        return switch (seatType){
            case AISLE -> aisleSuperCharge;
            case WINDOW -> windowSuperCharge;
            default -> 0.0;
        };
    }
}
