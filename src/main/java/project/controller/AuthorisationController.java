package project.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import project.repository.UserRepository;
import project.security.JwtAuthorizationService;
import project.security.exception.AuthenticationException;
import project.security.model.User;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Эндпоинты для выдачи токена с ролью либо код ошибки с комментарием.
 * Токен потом будет в cookie
 */
@RestController
@RequiredArgsConstructor
public class AuthorisationController {
    private final JwtAuthorizationService jwtAuthorizationService;

    @PostMapping("/auth/login")
    public ResponseEntity<Boolean> authenticate(@RequestBody User user, HttpServletResponse response) {
        try {

            String jwtToken = jwtAuthorizationService.createToken(user);

            response.addHeader(HttpHeaders.AUTHORIZATION, jwtToken);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            throw new AuthenticationException(e, "Ваша прошлая сессия истекла. +" +
                    "Войдите в аккаунт заново");
        }
    }

    @PostMapping("/auth/validate")
    public boolean validateToken( HttpServletRequest request) {
        if (jwtAuthorizationService.validateToken(request.getHeader("Authorization"))) {
            return true;
        }
        throw new AuthenticationException("Ваша прошлая сессия истекла. +" +
                "Войдите в аккаунт заново");
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Boolean> logout(HttpServletResponse response) {
        try {
            Cookie emptyToken = new Cookie("token", null);
            emptyToken.setPath("/");
            emptyToken.setMaxAge(0);
            emptyToken.setSecure(false);
            response.addCookie(emptyToken);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (Exception e) {
            throw new AuthenticationException(e, "Не получилось выйти из аккаунта");
        }
    }


}
