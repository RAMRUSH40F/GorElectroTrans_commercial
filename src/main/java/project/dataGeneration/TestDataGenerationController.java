package project.dataGeneration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import project.security.service.JwtAuthorizationService;

import static project.exceptions.Validator.validateDepartmentId;

@RestController
@Slf4j
@Lazy
public class TestDataGenerationController {

    private final TestDataGenerationService testDataGenerationService;
    private final JwtAuthorizationService authorizationService;

    public TestDataGenerationController(TestDataGenerationService testDataGenerationService,
                                        JwtAuthorizationService authorizationService) {
        this.testDataGenerationService = testDataGenerationService;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/dep_{N}/service/generateData")
    public ResponseEntity<String> generateData(@PathVariable("N") String depId,
                                               @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        authorizationService.authorize(jwtToken, departmentId);
        log.info("Start filling department number{}", departmentId);
        try {
            testDataGenerationService.addTestData(departmentId);
        } catch (RuntimeException e) {
            log.error("Exception during data generation: departmentId={}, exception={}", departmentId, e.getMessage());
            return ResponseEntity
                    .internalServerError()
                    .body("Exception during generation");
        }
        log.info("Ended filling data for department: departmentId={}", departmentId);
        return ResponseEntity
                .ok()
                .body("Department generated successfully");
    }
}
