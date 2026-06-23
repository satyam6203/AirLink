package com.airlink.user_service.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import payload.response.ApiResponse;

@RestController
public class HomeController {

    @GetMapping("/user")
    public ApiResponse HomeController(){
        ApiResponse response = new ApiResponse("Hey this is user service");
        return response;
    }
}
