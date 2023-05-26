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
    public void authorizeRequestsSubdepartment(String jwtToken, String depId) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }

    @Before("execution(* project.controller.LessonContentController.*(..)) && args(jwtToken)")
    public void authorizeRequestsLessonContent(String jwtToken) {
        auth.authorize(jwtToken, 100);
    }


    @Before("execution(* project.controller.ReportController.*(..)) && args(depId, jwtToken)")
    public void authorizeRequestsReportController(String jwtToken, String depId) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }


    @Before("execution(* project.controller.StudentController.*(..)) && args(depId, jwtToken)")
    public void authorizeRequestsStudentController(String jwtToken, String depId) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }


    @Before("execution(* project.controller.LessonController.*(..)) && args(depId, jwtToken)")
    public void authorizeRequestsLessonController(String jwtToken, String depId) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }


    @Before("execution(* project.controller.AttendanceController.*(..)) && args(depId, jwtToken)")
    public void authorizeRequestsAttendanceController(String jwtToken, String depId) {
        auth.authorize(jwtToken, Integer.parseInt(depId));
    }

}
