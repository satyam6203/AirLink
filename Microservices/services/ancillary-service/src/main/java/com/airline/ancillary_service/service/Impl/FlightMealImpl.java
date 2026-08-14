package com.airline.ancillary_service.service.Impl;

import com.airline.ancillary_service.Mapper.FlightMealMapper;
import com.airline.ancillary_service.Model.FlightMeal;
import com.airline.ancillary_service.Model.Meal;
import com.airline.ancillary_service.Repo.FlightMealRepository;
import com.airline.ancillary_service.Repo.MealRepository;
import com.airline.ancillary_service.service.FlightMealService;
import com.airline.ancillary_service.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.FlightMealRequest;
import payload.response.FlightMealResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightMealImpl implements FlightMealService {

    private final FlightMealRepository flightMealRepository;
    private final MealRepository mealRepository;

    @Override
    public FlightMealResponse create(FlightMealRequest request) throws Exception {
        Meal meal = mealRepository.findById(request.getMealId()).orElseThrow(
                () -> new Exception("Meal not found")
        );

        if(flightMealRepository.existsByFlightIdAndMealId(request.getFlightId(), meal.getId())){
            throw new Exception("Meal already exists for flight");
        }

        FlightMeal flightMeal = FlightMeal.builder()
                .flightId(request.getFlightId())
                .meal(meal)
                .isAvailable(request.getAvailable())
                .price(request.getPrice())
                .displayOrder(request.getDisplayOrder())
                .build();

        FlightMeal saved = flightMealRepository.save(flightMeal);
        return FlightMealMapper.toResponse(saved);
    }

    @Override
    public FlightMealResponse getById(Long id) throws Exception {
        FlightMeal flightMeal = flightMealRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Flight meal not found with this id")
                );
        return FlightMealMapper.toResponse(flightMeal);
    }

    @Override
    public List<FlightMealResponse> getByFlightId(Long flightId) {
        return flightMealRepository.findByFlightId(flightId)
                .stream()
                .map(FlightMealMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlightMealResponse> getAllByIds(List<Long> ids) {
        return flightMealRepository.findAllById(ids)
                .stream()
                .map(FlightMealMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FlightMealResponse update(Long id, FlightMealRequest request) throws Exception {
        FlightMeal flightMeal = flightMealRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Flight meal not found with this id")
                );

        flightMeal.setFlightId(request.getFlightId());
        if(request.getMealId() != null){
            Meal meal = mealRepository.findById(id)
                    .orElseThrow(
                            () -> new Exception("meal not found")
                    );
            flightMeal.setMeal(meal);
        }
        flightMeal.setIsAvailable(request.getAvailable());
        flightMeal.setPrice(request.getPrice());
        flightMeal.setDisplayOrder(request.getDisplayOrder());
        FlightMeal saved = flightMealRepository.save(flightMeal);
        return FlightMealMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) throws Exception {
        FlightMeal flightMeal = flightMealRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Flight meal not found with this id")
                );
        flightMealRepository.delete(flightMeal);
    }

    @Override
    public FlightMealResponse updateAvailability(Long id, Boolean available) throws Exception {
        FlightMeal flightMeal = flightMealRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Flight meal not found with this id")
                );
        flightMeal.setIsAvailable(available);
        FlightMeal updated = flightMealRepository.save(flightMeal);
        return FlightMealMapper.toResponse(updated);
    }

    @Override
    public Double calculateMealPrice(List<Long> mealIds) {
        List<FlightMeal> meals = flightMealRepository.findAllById(mealIds);
        double price = 0.0;
        for(FlightMeal meal : meals){
            price += meal.getPrice();
        }
        return price;
    }
}
