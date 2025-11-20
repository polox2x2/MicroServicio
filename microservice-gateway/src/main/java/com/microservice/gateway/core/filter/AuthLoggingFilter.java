package com.microservice.gateway.core.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(AuthLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .doOnNext(auth -> {
                    logger.info("Request Path: {}", exchange.getRequest().getPath());
                    logger.info("User: {}", auth.getName());
                    logger.info("Authorities: {}", auth.getAuthorities());
                })
                .switchIfEmpty(Mono.fromRunnable(
                        () -> logger.info("No Security Context found for path: {}", exchange.getRequest().getPath())))
                .then(chain.filter(exchange));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
