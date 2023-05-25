package project.security;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuthorizationAspect {

    private final JwtAuthorizationService auth;

    @Before("execution(* project.controller.SubdepartmentController.*(..)) && args(depId, jwtToken)")
    public void authorizeRequests(String jwtToken, String depId) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }


}
