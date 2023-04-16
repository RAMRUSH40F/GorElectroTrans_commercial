package project.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.exceptions.AuthenticationException;
import project.security.model.User;
import project.security.JwtAuthorizationService;

/**
 * Эндпоинты для выдачи токена с ролью либо код ошибки с комментарием.
 * Суем в header
 */
@RestController
@RequiredArgsConstructor
public class AuthorisationController {
    private final JwtAuthorizationService jwtAuthorizationService;

    @PostMapping("/auth/login")
    public ResponseEntity<String> authenticate(@RequestBody User user) {
        return ResponseEntity.ok(
                jwtAuthorizationService.
                        authenticate(user.getUsername(), user.getPassword()).getValue());
    }

    @GetMapping("/auth/validate")
    public boolean validateToken(@CookieValue(value = "Token", required = false) String token) {
        if (jwtAuthorizationService.validateToken(token)) {
            return true;
        }
        throw new AuthenticationException("Ваша прошлая сессия истекла. +" +
                "Войдите в аккаунт заново");
    }




}
