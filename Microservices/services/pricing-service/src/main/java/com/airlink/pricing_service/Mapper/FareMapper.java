package com.airlink.pricing_service.Mapper;

import com.airlink.pricing_service.Model.Fare;
import embeddable.*;
import payload.request.FareRequest;
import payload.response.FareResponse;

public class FareMapper {

    public static Fare toEntity(FareRequest request){
        if(request == null) return null;

        SeatsBenefits seatBenefits = SeatsBenefits.builder()
                .extraSeatsSpace(bool(request.getExtraSeatSpace()))
                .advanceSeatsSelection(bool(request.getAdvanceSeatSelection()))
                .preferredSeatsChoice(bool(request.getExtraSeatSpace()))
                .guaranteedSeatTogether(bool(request.getGuaranteedSeatTogether()))
                .build();

        BoardingBenefits boardingBenefits = BoardingBenefits.builder()
                .priorityBoarding(bool(request.getPriorityBoarding()))
                .fastTrackSecurity(bool(request.getFastTrackSecurity()))
                .priorityChecking(bool((request.getPriorityChecking())))
                .build();

        InFlightBenefits inFlightBenefits = InFlightBenefits.builder()
                .inFlightEntertainment(bool(request.getInFlightEntertainment()))
                .inFlightInternet(bool(request.getInFlightInternet()))
                .complimentaryMeals(bool(request.getComplimentaryMeals()))
                .premiumMealChoice(bool(request.getPremiumMealChoice()))
                .complimentaryBeverages(request.getComplimentaryBeverages())
                .build();

        FlexibilityBenefits flexibilityBenefits = FlexibilityBenefits.builder()
                .freeDateChange(bool(request.getFreeDateChange()))
                .fullRefund(bool(request.getFullRefund()))
                .partialRefund(bool(request.getPartialRefund()))
                .build();

        PremiumServiceBenefits premiumServiceBenefits = PremiumServiceBenefits.builder()
                .airportTransfer(bool(request.getAirportTransfer()))
                .loungeAccess(bool(request.getLoungeAccess()))
                .build();

        Double calculatedPrice = request.getCurrentPrice();
        if(calculatedPrice == null){
            calculatedPrice = request.getBaseFare()
                    +(request.getTaxesAndFees() != null ? request.getTaxesAndFees() : 0.0)
                    +(request.getAirlineFees() != null ? request.getAirlineFees() : 0.0);
        }

        return Fare.builder()
                .name(request.getName())
                .rbdCode(request.getRbdCode())
                .flightId(request.getFlightId())
                .cabinClassId(request.getCabinClassId())
                .baseFare(request.getBaseFare())
                .texesAndFees(request.getTaxesAndFees())
                .airlineFees(request.getAirlineFees())
                .currentPrice(calculatedPrice)
                .fareLabel(request.getFareLabel())
                .seatsBenefits(seatBenefits)
                .boardingBenefits(boardingBenefits)
                .inFlightBenefits(inFlightBenefits)
                .flexibilityBenefits(flexibilityBenefits)
                .premiumServiceBenefits(premiumServiceBenefits)
                .build();
    }

    public static FareResponse toResponse(Fare fare){
        return FareResponse.builder()
                .id(fare.getId())
                .name(fare.getName())
                .rbdCode(fare.getRbdCode())
                .cabinClass(fare.getCabinClassType())
                .baseFare(fare.getBaseFare())
                .cabinClassId(fare.getCabinClassId())
                .airlineFees(fare.getAirlineFees())
                .baseFare(fare.getBaseFare())
                .currentPrice(fare.getCurrentPrice())
                .flightId(fare.getFlightId())
                .taxesAndFees(fare.getTexesAndFees())
                .currentPrice(fare.getCurrentPrice())
                .totalPrice(fare.getTotalPrice())
                .fareLabel(fare.getFareLabel())
                .fareRulesId(fare.getFareRules() != null ? fare.getFareRules().getId() : null)
                .extraSeatSpace(fare.getSeatsBenefits() != null ? fare.getSeatsBenefits().getExtraSeatsSpace() : false)
                .preferredSeatChoice(fare.getSeatsBenefits() != null ? fare.getSeatsBenefits().getPreferredSeatsChoice() : false)
                .advanceSeatSelection(fare.getSeatsBenefits() != null ? fare.getSeatsBenefits().getAdvanceSeatsSelection() : false)
                .guaranteedSeatTogether(fare.getSeatsBenefits() != null ? fare.getSeatsBenefits().getGuaranteedSeatTogether() : false)
                // Boarding benefits
                .priorityBoarding(fare.getBoardingBenefits() != null ? fare.getBoardingBenefits().getPriorityBoarding() : false)
                .priorityChecking(fare.getBoardingBenefits() != null ? fare.getBoardingBenefits().getPriorityChecking() : false)
                .fastTrackSecurity(fare.getBoardingBenefits() != null ? fare.getBoardingBenefits().getFastTrackSecurity() : false)
                // In-flight benefits
                .complimentaryMeals(fare.getInFlightBenefits() != null ? fare.getInFlightBenefits().getComplimentaryMeals() : false)
                .premiumMealChoice(fare.getInFlightBenefits() != null ? fare.getInFlightBenefits().getPremiumMealChoice() : false)
                .inFlightInternet(fare.getInFlightBenefits() != null ? fare.getInFlightBenefits().getInFlightInternet() : false)
                .inFlightEntertainment(fare.getInFlightBenefits() != null ? fare.getInFlightBenefits().getInFlightEntertainment() : false)
                .complimentaryBeverages(fare.getInFlightBenefits() != null ? fare.getInFlightBenefits().getComplimentaryBeverages() : false)
                // Flexibility benefits
                .freeDateChange(fare.getFlexibilityBenefits() != null ? fare.getFlexibilityBenefits().getFreeDateChange() : false)
                .partialRefund(fare.getFlexibilityBenefits() != null ? fare.getFlexibilityBenefits().getPartialRefund() : false)
                .fullRefund(fare.getFlexibilityBenefits() != null ? fare.getFlexibilityBenefits().getFullRefund() : false)
                // Premium service benefits
                .loungeAccess(fare.getPremiumServiceBenefits() != null ? fare.getPremiumServiceBenefits().getLoungeAccess() : false)
                .airportTransfer(fare.getPremiumServiceBenefits() != null ? fare.getPremiumServiceBenefits().getAirportTransfer() : false)
//                // Nested responses
                .fareRules(fare.getFareRules() != null ? FareRuleMapper.toResponse(fare.getFareRules()) : null)
                .baggagePolicy(fare.getBaggagePolicy() != null ? BaggagePolicyMapper.toResponse(fare.getBaggagePolicy()) : null)
                .createdAt(fare.getCreatedAt())
                .updatedAt(fare.getUpdatedAt())
                .build();
    }

    public static void updateEntity(FareRequest request, Fare existing){
        if (request == null || existing == null) return;
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getRbdCode() != null) existing.setRbdCode(request.getRbdCode());
        if (request.getFlightId() != null) existing.setFlightId(request.getFlightId());
        if (request.getCabinClassId() != null) existing.setCabinClassId(request.getCabinClassId());

        if (request.getBaseFare() != null) existing.setBaseFare(request.getBaseFare());
        if (request.getTaxesAndFees() != null) existing.setTexesAndFees(request.getTaxesAndFees());
        if (request.getAirlineFees() != null) existing.setAirlineFees(request.getAirlineFees());
        if (request.getCurrentPrice() != null) existing.setCurrentPrice(request.getCurrentPrice());
        if (request.getFareLabel() != null) existing.setFareLabel(request.getFareLabel());

        // Update embedded benefits
        SeatsBenefits sb = existing.getSeatsBenefits();
        if (request.getExtraSeatSpace() != null) sb.setExtraSeatsSpace(request.getExtraSeatSpace());
        if (request.getPreferredSeatChoice() != null) sb.setPreferredSeatsChoice(request.getPreferredSeatChoice());
        if (request.getAdvanceSeatSelection() != null) sb.setAdvanceSeatsSelection(request.getAdvanceSeatSelection());
        if (request.getGuaranteedSeatTogether() != null) sb.setGuaranteedSeatTogether(request.getGuaranteedSeatTogether());

        BoardingBenefits bb = existing.getBoardingBenefits();
        if (request.getPriorityBoarding() != null) bb.setPriorityBoarding(request.getPriorityBoarding());
        if (request.getPriorityChecking() != null) bb.setPriorityChecking(request.getPriorityChecking());
        if (request.getFastTrackSecurity() != null) bb.setFastTrackSecurity(request.getFastTrackSecurity());

        InFlightBenefits ifb = existing.getInFlightBenefits();
        if (request.getComplimentaryMeals() != null) ifb.setComplimentaryMeals(request.getComplimentaryMeals());
        if (request.getPremiumMealChoice() != null) ifb.setPremiumMealChoice(request.getPremiumMealChoice());
        if (request.getInFlightInternet() != null) ifb.setInFlightInternet(request.getInFlightInternet());
        if (request.getInFlightEntertainment() != null) ifb.setInFlightEntertainment(request.getInFlightEntertainment());
        if (request.getComplimentaryBeverages() != null) ifb.setComplimentaryBeverages(request.getComplimentaryBeverages());

        FlexibilityBenefits fb = existing.getFlexibilityBenefits();
        if (request.getFreeDateChange() != null) fb.setFreeDateChange(request.getFreeDateChange());
        if (request.getPartialRefund() != null) fb.setPartialRefund(request.getPartialRefund());
        if (request.getFullRefund() != null) fb.setFullRefund(request.getFullRefund());

        PremiumServiceBenefits psb = existing.getPremiumServiceBenefits();
        if (request.getLoungeAccess() != null) psb.setLoungeAccess(request.getLoungeAccess());
        if (request.getAirportTransfer() != null) psb.setAirportTransfer(request.getAirportTransfer());
    }

    private static Boolean bool(Boolean value){
        return value != null ? value : false;
    }
}


