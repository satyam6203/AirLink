package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Mapper.SeatInstanceMapper;
import com.arilink.seat_service.Model.SeatInstance;
import com.arilink.seat_service.Repo.SeatInstanceRepo;
import com.arilink.seat_service.Service.SeatInstanceService;

import enums.SeatAvailabilityStatus;
import lombok.RequiredArgsConstructor;
import payload.response.SeatInstanceResponse;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatInstanceServiceImpl implements SeatInstanceService {

    private final SeatInstanceRepo seatInstanceRepo;

    @Override
    public Double calculateSeatPrice(List<Long> seatInstanceId) {
        if (seatInstanceId == null || seatInstanceId.isEmpty()) {
            return 0.0;
        }
        List<Long> validIds = seatInstanceId.stream()
                .filter(java.util.Objects::nonNull)
                .toList();
        if (validIds.isEmpty()) {
            return 0.0;
        }
        List<SeatInstance> seatInstances = seatInstanceRepo.findAllById(validIds);
        double price = 0.0;
        for(SeatInstance s : seatInstances){
            double premium = s.getPremiumSurcharge() != null ? s.getPremiumSurcharge() : 0;
            price += premium;
        }
        return price;
    }

    @Override
    public SeatInstanceResponse updateSeatInstanceStatus(Long seaInstanceId, SeatAvailabilityStatus status) {
        SeatInstance seatInstance = seatInstanceRepo.findById(seaInstanceId).orElse(null);
        if(seatInstance == null) return null;
        seatInstance.setStatus(status);
        seatInstanceRepo.save(seatInstance);
        return SeatInstanceMapper.toResponse(seatInstance);
    }
}
