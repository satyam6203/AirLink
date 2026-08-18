package com.arilink.seat_service.Service.Impl;

import com.arilink.seat_service.Model.SeatInstance;
import com.arilink.seat_service.Repo.SeatInstanceRepo;
import com.arilink.seat_service.Service.SeatInstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatInstanceServiceImpl implements SeatInstanceService {

    private final SeatInstanceRepo seatInstanceRepo;

    @Override
    public Double calculateSeatPrice(List<Long> seatInstanceId) {
        List<SeatInstance> seatInstances = seatInstanceRepo.findAllById(seatInstanceId);
        double price = 0.0;
        for(SeatInstance s : seatInstances){
            double premium = s.getPremiumSurcharge() != null ? s.getPremiumSurcharge() : 0;
            price += premium;
        }
        return price;
    }
}
