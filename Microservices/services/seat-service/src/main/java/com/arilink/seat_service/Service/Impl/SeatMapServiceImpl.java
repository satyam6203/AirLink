package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Client.AirlineClient;
import com.arilink.seat_service.Exception.BadRequestException;
import com.arilink.seat_service.Exception.ResourceNotFoundException;
import com.arilink.seat_service.Mapper.SeatMapMapper;
import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Model.Seat;
import com.arilink.seat_service.Model.SeatMap;
import com.arilink.seat_service.Repo.CabinClassRepo;
import com.arilink.seat_service.Repo.SeatMapRepo;
import com.arilink.seat_service.Repo.SeatRepo;
import com.arilink.seat_service.Service.SeatMapService;
import com.arilink.seat_service.Service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import payload.request.SeatMapRequest;
import payload.response.AirLineResponse;
import payload.response.SeatMapResponse;

import java.util.List;

@Service
@AllArgsConstructor
public class SeatMapServiceImpl implements SeatMapService {

    private final SeatMapRepo seatMapRepo;
    private final CabinClassRepo cabinClassRepo;
    private final SeatService seatService;
    private final AirlineClient airlineClient;
    private final SeatRepo seatRepo;

    @Override
    @Transactional
    public SeatMapResponse createSeatMap(Long userId, SeatMapRequest request) throws Exception {
        AirLineResponse response = airlineClient.getAirLineByOwner(userId);
        CabinClass cabinClass = cabinClassRepo.findById(request.getCabinClassId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("cabin class not found with cabinId " + request.getCabinClassId())
                );
        if(seatMapRepo.existsByCabinClassId(request.getCabinClassId())){
            throw new BadRequestException("seat map already exists for this cabin class");
        }
        if(seatMapRepo.existsByAirlineIdAndCabinClassIdAndName(
                response.getId(),
                request.getCabinClassId(),
                request.getName()
        )){
            throw new BadRequestException("seat map already exists with given name for this cabin class");
        }
        SeatMap seatMap = SeatMapMapper.toEntity(request, cabinClass);
        seatMap.setAirlineId(response.getId());
        SeatMap saved = seatMapRepo.save(seatMap);
        seatService.generateSeats(saved.getId());
        SeatMap reloaded = seatMapRepo.findById(saved.getId()).orElse(saved);
        List<Seat> seats = seatRepo.findBySeatMapId(reloaded.getId());
        reloaded.setSeats(seats);
        return SeatMapMapper.toResponse(reloaded);
    }

    @Override
    public SeatMapResponse getSeatMapById(Long id) throws Exception {
        SeatMap seatMap = seatMapRepo.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("seat map not found with this id " + id)
        );
        return SeatMapMapper.toResponse(seatMap);
    }

    @Override
    public SeatMapResponse getSeatMapByCabinClass(Long cabinClassId) throws Exception {
        SeatMap seatMap = seatMapRepo.findByCabinClassId(cabinClassId);
        if(seatMap == null){
            throw new ResourceNotFoundException("seat map not found with this cabin class " + cabinClassId);
        }
        return SeatMapMapper.toResponse(seatMap);
    }

    @Override
    public SeatMapResponse updateSeatMap(Long id, SeatMapRequest request) throws Exception {
        SeatMap seatMap = seatMapRepo.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("seat map not found with this id " + id)
        );
        SeatMapMapper.updateEntity(request, seatMap);
        SeatMap updated = seatMapRepo.save(seatMap);
        return SeatMapMapper.toResponse(updated);
    }

    @Override
    public void deleteSeatMap(Long id) throws Exception {
        SeatMap seatMap = seatMapRepo.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("seat map not found with this id " + id)
        );
        seatMapRepo.delete(seatMap);
    }
}
