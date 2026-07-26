package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Mapper.CabinClassMapper;
import com.arilink.seat_service.Mapper.SeatMapMapper;
import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Model.SeatMap;
import com.arilink.seat_service.Repo.CabinClassRepo;
import com.arilink.seat_service.Repo.SeatMapRepo;
import com.arilink.seat_service.Service.SeatMapService;
import com.arilink.seat_service.Service.SeatService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.SeatMapRequest;
import payload.response.SeatMapResponse;

@Service
@AllArgsConstructor
public class SeatMapServiceImpl implements SeatMapService {

    private final SeatMapRepo seatMapRepo;
    private final CabinClassRepo cabinClassRepo;
    private final SeatService seatService;

    @Override
    public SeatMapResponse createSeatMap(Long airlineId, SeatMapRequest request) throws Exception {

        CabinClass cabinClass = cabinClassRepo.findById(request.getCabinClassId())
                .orElseThrow(
                        () -> new Exception("cabin class not found with cabinId")
                );
        if(seatMapRepo.existsByAirlineIdAndCabinClassIdAndName(
                airlineId,
                request.getCabinClassId(),
                request.getName()
        )){
            throw new Exception("cabin class already exists with given name");
        }
        SeatMap seatMap = SeatMapMapper.toEntity(request, cabinClass);
        seatMap.setAirlineId(airlineId);
        SeatMap saved = seatMapRepo.save(seatMap);
        seatService.generateSeats(saved.getId());
        return SeatMapMapper.toResponse(saved);
    }

    @Override
    public SeatMapResponse getSeatMapById(Long id) throws Exception {
        SeatMap seatMap = seatMapRepo.findById(id).orElseThrow(
                ()-> new Exception("seat map not found with this id")
        );
        return SeatMapMapper.toResponse(seatMap);
    }

    @Override
    public SeatMapResponse getSeatMapByCabinClass(Long cabinClassId) throws Exception {
        SeatMap seatMap = seatMapRepo.findByCabinClassId(cabinClassId);
        if(seatMap == null){
            throw new Exception("seat map not found with his cabin class");
        }
        return SeatMapMapper.toResponse(seatMap);
    }

    @Override
    public SeatMapResponse updateSeatMap(Long id, SeatMapRequest request) throws Exception {
        SeatMap seatMap = seatMapRepo.findById(id).orElseThrow(
                ()-> new Exception("seat map not found with this id")
        );
        SeatMapMapper.updateEntity(request, seatMap);
        SeatMap updated = seatMapRepo.save(seatMap);
        return SeatMapMapper.toResponse(updated);
    }

    @Override
    public void deleteSeatMap(Long id) throws Exception {
        SeatMap seatMap = seatMapRepo.findById(id).orElseThrow(
                ()-> new Exception("seat map not found with this id")
        );
        seatMapRepo.delete(seatMap);
    }
}
