package project.security;

import project.security.model.User;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import project.security.service.JwtAuthorizationService;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class JwtAuthorizationServiceTest {

    @Autowired
    JwtAuthorizationService service;

    @Test
    void validateToken() {
    }

    @Test
    void decodeUserFromToken() {
    }

    @Test
    void authenticate() {
        String token = service.authenticate(User.builder().username("LolsaF").password("125125").build());
        System.out.println(service.decodeUserFromToken(token));
        assertFalse(token.isEmpty());

    }

    @Test
    void authorize() {
        String token = service.authenticate(User.builder().username("LolsaF").password("125125").build());
        System.out.println(service.decodeUserFromToken(token));
        service.authorize(token, 100);
        service.authorize(token, 2);
    }
}