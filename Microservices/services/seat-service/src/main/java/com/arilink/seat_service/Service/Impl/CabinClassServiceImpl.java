package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Exception.BadRequestException;
import com.arilink.seat_service.Exception.ResourceNotFoundException;
import com.arilink.seat_service.Mapper.CabinClassMapper;
import com.arilink.seat_service.Model.CabinClass;
import com.arilink.seat_service.Repo.CabinClassRepo;
import com.arilink.seat_service.Service.CabinClassService;
import enums.CabinClassType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.CabinClassRequest;
import payload.response.CabinClassResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CabinClassServiceImpl implements CabinClassService {

    private final CabinClassRepo cabinClassRepo;

    @Override
    public CabinClassResponse createCabinClass(CabinClassRequest request) throws Exception {
        if(cabinClassRepo.existsByCodeAndAircraftId(
                request.getCode().toUpperCase(),
                request.getAircraftId()
        )){
            throw new BadRequestException("cabin class with code already exist");
        }
        CabinClass cabinClass = CabinClassMapper.toEntity(request);
        CabinClass saved = cabinClassRepo.save(cabinClass);
        return CabinClassMapper.toResponse(saved, null);
    }

    @Override
    public CabinClassResponse getCabinClassById(Long id) throws Exception {
        CabinClass cabinClass = cabinClassRepo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("cabin class not found with this id " + id)
        );
        return CabinClassMapper.toResponse(cabinClass, cabinClass.getSeatMap());
    }

    @Override
    public List<CabinClassResponse> getCabinClassesByAircraftId(Long aircraftId) {
        return cabinClassRepo.findByAircraftId(aircraftId)
                .stream()
                .map(cc -> CabinClassMapper.toResponse(cc, cc.getSeatMap()))
                .collect(Collectors.toList());
    }

    @Override
    public CabinClassResponse getByAircraftIdAndName(Long aircraftId, CabinClassType name) {
        CabinClass cabinClass = cabinClassRepo.findByAircraftIdAndName(aircraftId, name);
        if(cabinClass == null){
            throw new ResourceNotFoundException(
                    "cabin class not found for aircraft " + aircraftId + " and name " + name);
        }
        return CabinClassMapper.toResponse(cabinClass, cabinClass.getSeatMap());
    }

    @Override
    public CabinClassResponse updatedCabinClass(Long id, CabinClassRequest request) throws Exception {
        CabinClass cabinClass = cabinClassRepo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("cabin class not found with this id " + id)
        );
        if(request.getCode() != null && cabinClassRepo.existsByCodeAndAircraftIdAndIdNot(
                request.getCode().toUpperCase(),
                request.getAircraftId() != null ? request.getAircraftId() : cabinClass.getAircraftId(),
                cabinClass.getId()
        )){
            throw new BadRequestException("Cabin class with code already exists ");
        }
        CabinClassMapper.updateEntity(request, cabinClass);
        CabinClass updatedClass = cabinClassRepo.save(cabinClass);
        return CabinClassMapper.toResponse(updatedClass, updatedClass.getSeatMap());
    }

    @Override
    public void deleteCabinClass(Long id) throws Exception {
        CabinClass cabinClass = cabinClassRepo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("cabin class not found with this id " + id)
        );
        cabinClassRepo.delete(cabinClass);
    }
}
