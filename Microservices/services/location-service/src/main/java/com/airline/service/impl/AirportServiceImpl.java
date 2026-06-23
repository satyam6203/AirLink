package com.airline.service.impl;

import com.airline.Mapper.AirPortMapper;
import com.airline.Model.Airport;
import com.airline.Model.City;
import com.airline.Repo.AirportRepo;
import com.airline.Repo.CityRepo;
import com.airline.service.AirportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.request.AirportRequest;
import payload.response.AirportResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AirportServiceImpl implements AirportService {

    private final AirportRepo airportRepo;
    private final CityRepo cityRepo;

    @Override
    public AirportResponse createAirport(AirportRequest request) throws Exception {
        if(airportRepo.findByIataCode(request.getIataCode()).isPresent()){
            throw new Exception("Airport with this iata code already exists");
        }
        City city = cityRepo.findById(request.getCityId()).orElseThrow(
                ()->new Exception("City not found")
        );
        Airport airport = AirPortMapper.toEntity(request);
        airport.setCity(city);

        Airport savedAirport = airportRepo.save(airport);
        return AirPortMapper.toResponse(savedAirport);
    }

    @Override
    public AirportResponse getAirportById(Long id) throws Exception {
        Airport airport = airportRepo.findById(id).orElseThrow(
                ()-> new Exception("Airport not exists with the provided id")
        );
        return AirPortMapper.toResponse(airport);
    }

    @Override
    public List<AirportResponse> getAllAirports() {
        return airportRepo.findAll()
                .stream()
                .map(AirPortMapper :: toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AirportResponse updateAirport(Long id, AirportRequest request) throws Exception {
        Airport existingAirport = airportRepo.findById(id).orElseThrow(
                ()-> new Exception("Airport not exists with id " + id)
        );

        if(request.getIataCode() != null
                && !existingAirport.getIataCode().equals(request.getIataCode())
                && airportRepo.findByIataCode(request.getIataCode()).isPresent()
        ){
            throw new Exception("Airport with iata code Already Exists");
        }

        AirPortMapper.updateEntity(request, existingAirport);
        Airport updatedAirport = airportRepo.save(existingAirport);
        return AirPortMapper.toResponse(updatedAirport);
    }

    @Override
    public void deleteAirport(long id) throws Exception {
        Airport airport = airportRepo.findById(id).orElseThrow(
                ()-> new Exception("Airport not exists with the provided id")
        );
        airportRepo.delete(airport);
    }

    @Override
    public List<AirportResponse> getAirportByCityId(Long cityId) {
        return airportRepo.findByCityId(cityId)
                .stream()
                .map(AirPortMapper :: toResponse)
                .collect(Collectors.toList());
    }
}
