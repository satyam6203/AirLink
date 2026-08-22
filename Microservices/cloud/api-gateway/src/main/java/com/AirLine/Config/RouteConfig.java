package com.AirLine.Config;

import enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.function.*;
import payload.dto.UserDTO;

import javax.print.attribute.standard.Severity;

@Configuration
public class RouteConfig {

    @Autowired
    private JwtUtils jwtUtils;

    @Bean
    public RouterFunction<ServerResponse> authRoutes(){
        return GatewayRouterFunctions.route("auth-routes")
                .route(RequestPredicates.path("/auth/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("user-service"))
                .build();
    }

    @Bean
    @Order(1)
    public RouterFunction<ServerResponse> adminLocationServiceRoutes() {
        return GatewayRouterFunctions.route("admin-location-routes")
                .route(RequestPredicates.POST("/api/cities/**"), HandlerFunctions.http())
                .route(RequestPredicates.POST("/api/airports/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("location-service"))
                .before(this :: JwtAuthFilter)
                .before(request -> requiredRole(request, UserRole.ROLE_SYSTEM_ADMIN.toString()))
                .build();
    }

    @Bean
    @Order(1)
    public RouterFunction<ServerResponse> adminAirlineCoreServiceRoutes(){
        return GatewayRouterFunctions.route("admin-airline-core-routes")
                .route(RequestPredicates.GET("/api/airlines"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("airline-core-service"))
                .before(this :: JwtAuthFilter)
                .before(request -> requiredRole(request, UserRole.ROLE_SYSTEM_ADMIN.toString()))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> userServiceRoutes(){
        return GatewayRouterFunctions.route("user-service-route")
                .route(RequestPredicates.path("/api/users/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("user-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    @Order(2)
    public RouterFunction<ServerResponse> airlineCoreServiceRoutes(){
        return GatewayRouterFunctions.route("airline-core-routes")
                .route(RequestPredicates.path("/api/airlines/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/aircraft/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("airline-core-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> seatServiceRoutes() {
        return GatewayRouterFunctions.route("seat-service-routes")
                .route(RequestPredicates.path("/api/cabin-classes/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/seat-maps/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/seats/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/seat-instances/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/flight-instance-cabins/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("seat-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> flightOpsServiceRoutes() {
        return GatewayRouterFunctions.route("flight-ops-routes")
                .route(RequestPredicates.path("/api/flights/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/flight-instances/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/flight-schedules/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("flight-ops-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> pricingServiceRoutes() {
        return GatewayRouterFunctions.route("pricing-service-routes")
                .route(RequestPredicates.path("/api/fares/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/fare-rules/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/baggage-policies/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("pricing-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> AncillaryServiceRoutes() {
        return GatewayRouterFunctions.route("ancillary-service-routes")
                .route(RequestPredicates.path("/api/meals/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/ancillaries/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/insurance-coverages/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/flight-meals/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/flight-cabin-ancillaries/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("ancillary-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    @Order(2)
    public RouterFunction<ServerResponse> locationServiceRoutes() {
        return GatewayRouterFunctions.route("location-service-routes")
                .route(RequestPredicates.path("/api/cities/**"), HandlerFunctions.http())
                .route(RequestPredicates.path("/api/airports/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("location-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> bookingServiceRoutes() {
        return GatewayRouterFunctions.route("booking-service-routes")
                .route(RequestPredicates.path("/api/bookings/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("booking-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> paymentServiceRoutes() {
        return GatewayRouterFunctions.route("payment-service-routes")
                .route(RequestPredicates.path("/api/payments/**"), HandlerFunctions.http())
                .filter(LoadBalancerFilterFunctions.lb("payment-service"))
                .before(this :: JwtAuthFilter)
                .build();
    }

    private ServerRequest JwtAuthFilter(ServerRequest request){
        String authHeader = request.headers().firstHeader(JwtConstant.JWT_HEADER);

        if(authHeader == null || !authHeader.startsWith(JwtConstant.TOKEN_PREFIX)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"missing or invalid authorization token");
        }

        String token = authHeader.substring(JwtConstant.TOKEN_PREFIX.length());

        if(!jwtUtils.isTokenValid(token)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "invalid or expired JWT token"
            );
        }

        String email = jwtUtils.extractEmail(token);
        String authorization = jwtUtils.extractAuthorities(token);
        Long userId = jwtUtils.extractUser(token);

        return ServerRequest.from(request)
                .header("X-User-Id", String.valueOf(userId))
                .header("X-User-Email", email)
                .header("X-User-Roles", authorization)
                .build();
    }

    private ServerRequest requiredRole(ServerRequest request, String role){
        String roles = request.headers().firstHeader("X-User-Role");
        if(role == null || !roles.contains(role)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "access denied, required role" + role + " ");
        }
        return request;
    }
}
