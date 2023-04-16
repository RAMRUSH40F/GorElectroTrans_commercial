package project.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import project.exceptions.AuthenticationException;
import project.security.JwtAuthorizationService;
import project.security.model.User;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Эндпоинты для выдачи токена с ролью либо код ошибки с комментарием.
 * Токен потом будет в header
 */
@RestController
@RequiredArgsConstructor
public class AuthorisationController {
    private final JwtAuthorizationService jwtAuthorizationService;

    @PostMapping("/auth/login")
    public ResponseEntity<Boolean> authenticate(@RequestBody User user, HttpServletResponse response) {
        try {
            Cookie jwtToken = jwtAuthorizationService.
                    authenticate(user.getUsername(), user.getPassword());

            response.addCookie(jwtToken);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            throw new AuthenticationException(e, "Ваша прошлая сессия истекла. +" +
                    "Войдите в аккаунт заново");
        }
    }

    @PostMapping("/auth/validate")
    public boolean validateToken(@CookieValue(value = "token", defaultValue = "") String token) {
        if (token.length() != 0 && jwtAuthorizationService.validateToken(token)) {
            return true;
        }
        throw new AuthenticationException("Ваша прошлая сессия истекла. +" +
                "Войдите в аккаунт заново");
    }


}
