package com.airline.controller;

import payload.response.ApiResponse;

public class HomeController {

    public String home(){
        ApiResponse api = new ApiResponse();
        return "hello";
    }
}
