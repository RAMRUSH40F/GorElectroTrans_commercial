package project.security;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import project.security.service.JwtAuthorizationService;
import project.security.exception.AuthenticationException;
import project.security.model.User;

import static java.lang.Boolean.TRUE;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;



/**
 * Эндпоинты для выдачи токена с ролью либо код ошибки с комментарием.
 * Токен потом будет в cookie
 */
@RestController
@RequiredArgsConstructor
public class AuthorisationController {
    private final JwtAuthorizationService jwtAuthorizationService;

    @PostMapping("/auth/login")
    public ResponseEntity<Boolean> authenticate(@RequestBody User user) {
        try {
            String jwtToken = jwtAuthorizationService.authenticate(user);
            return ResponseEntity.ok()
                    .header(AUTHORIZATION, jwtToken)
                    .body(TRUE);
        } catch (Exception e) {
            throw new AuthenticationException(e, "Ваша прошлая сессия истекла. " +
                    "Войдите в аккаунт заново");
        }
    }

    @PostMapping("/auth/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader(value = AUTHORIZATION, defaultValue = "") String jwtToken) {
        if (jwtAuthorizationService.validateToken(jwtToken)) {
            return ResponseEntity.ok()
                    .header(AUTHORIZATION, jwtToken)
                    .body(TRUE);
        }
        throw new AuthenticationException("Ваша прошлая сессия истекла. " +
                "Войдите в аккаунт заново");
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Boolean> logout() {
        try {
            return ResponseEntity.ok()
                    .header(AUTHORIZATION,"")
                    .body(TRUE);
        } catch (Exception e) {
            throw new AuthenticationException(e, "Не получилось выйти из аккаунта");
        }
    }

}
