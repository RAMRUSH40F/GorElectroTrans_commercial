package project.authentication;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import project.authentication.service.JwtAuthorizationService;

@Aspect
@Component
@RequiredArgsConstructor
public class AuthorizationAspect {

    private final JwtAuthorizationService auth;

    @Before("execution(* project.controller.LessonController.*(..)) && args(depId, .., jwtToken)")
    public void authorizeRequestsLessonController(String depId, String jwtToken) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }
}
