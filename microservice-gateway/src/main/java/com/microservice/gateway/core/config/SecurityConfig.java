package com.microservice.gateway.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    @SuppressWarnings("null")
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .addFilterBefore((exchange, chain) -> {
                    return ReactiveSecurityContextHolder.getContext()
                            .map(SecurityContext::getAuthentication)
                            .doOnNext(auth -> {
                                System.out.println("DEBUG: Authenticated User: " + auth.getName());
                                System.out.println("DEBUG: Authorities: " + auth.getAuthorities());
                            })
                            .then(chain.filter(exchange));
                }, SecurityWebFiltersOrder.AUTHORIZATION)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/actuator/**", "/api/public/**", "/api/auth/**").permitAll()
                        .pathMatchers("/api/tickets/**")
                        .hasAnyAuthority("SCOPE_student", "SCOPE_teacher", "SCOPE_admin")
                        .pathMatchers("/api/crm/**").hasAnyAuthority("SCOPE_admin", "SCOPE_student")
                        .anyExchange().authenticated())
                .oauth2ResourceServer(
                        oauth2 -> oauth2.jwt(org.springframework.security.config.Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public org.springframework.security.oauth2.jwt.ReactiveJwtDecoder jwtDecoder() {
        byte[] keyBytes = "supersecretkey_must_be_at_least_32_bytes_long_for_hs256".getBytes();
        javax.crypto.SecretKey secretKey = new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA256");
        return org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }
}
