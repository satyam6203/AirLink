package com.AirLink.booking_service.Integration;

import com.AirLink.booking_service.Client.PricingClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.response.FareResponse;

@Service
@RequiredArgsConstructor
public class PricingIntegrationService {

    private final PricingClient pricingClient;

    public Double calculateFareTotal(Long fareId) {
        FareResponse fare = pricingClient.getFareById(fareId);
        Double baseFare = fare.getBaseFare();
        Double taxesAndFees = fare.getTaxesAndFees() != null ? fare.getTaxesAndFees() : 0.0;
        Double airlineFees = fare.getAirlineFees() != null ? fare.getAirlineFees() : 0.0;
        return baseFare+taxesAndFees + airlineFees;
    }
}
