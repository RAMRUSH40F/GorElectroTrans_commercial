package project.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.exceptions.AuthenticationException;
import project.model.User;
import project.security.JwtAuthorizationService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Эндпоинты для выдачи токена с ролью либо код ошибки с комментарием.
 * Суем в header
 */
@RestController
@RequiredArgsConstructor
public class AuthorisationController {
    private final JwtAuthorizationService jwtAuthorizationService;

    @PostMapping("/auth/login")
    public void authenticate(@RequestParam User user, HttpServletResponse response) {
        Cookie JwtToken = jwtAuthorizationService.authenticate(user.getUsername(), user.getPassword());
        response.addCookie(JwtToken);
    }

    @GetMapping("/auth/validate")
    public boolean validateToken(@CookieValue(value = "Token", required = false) String token) {
        if (jwtAuthorizationService.validateToken(token)) {
            return true;
        }
        throw new AuthenticationException("Ваша прошлая сессия истекла. +" +
                "Войдите заново в аккаунт");
    }


}
