package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Mapper.FlightInstanceCabinMapper;
import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Model.FlightInstanceCabin;
import com.arilink.seat_service.Model.SeatMap;
import com.arilink.seat_service.Repo.CabinClassRepo;
import com.arilink.seat_service.Repo.FlightInstanceCabinRepo;
import com.arilink.seat_service.Repo.SeatMapRepo;
import com.arilink.seat_service.Service.FlightInstanceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import payload.request.FlightInstanceCabinRequest;
import payload.response.FlightInstanceCabinResponse;

@Service
@RequiredArgsConstructor
public class FlightInstanceCabinServiceImpl implements FlightInstanceService {

    private final FlightInstanceCabinRepo flightInstanceCabinRepo;
    private final CabinClassRepo cabinClassRepo;
    private final SeatMapRepo seatMapRepo;

    @Override
    public FlightInstanceCabinResponse createFlightInstanceCabin(FlightInstanceCabinRequest request) throws Exception {

        CabinClass cabinClass = cabinClassRepo.findById(request.getFlightId())
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
            CabinClass cabinClass = cabinClassRepo.findById(request.getFlightId()).orElseThrow(
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
}
