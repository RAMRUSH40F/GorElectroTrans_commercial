package project.multiplier.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.multiplier.service.TestDataGenerator;

@RestController
@RequestMapping("/service")
@Slf4j
@Profile("docker")
public class DataGenerationController {
    @Autowired
    private TestDataGenerator testDataGenerator;

    @GetMapping("/dep_{n}/generateData")
    public String generateDepData(@PathVariable Integer n) {
        log.info("Start filling department number{}", n);
        try {
            testDataGenerator.addTestData(n);
        } catch (Exception e) {
            log.error("Exception during data generation in department {}", n, e);
            return "Exception during generation";
        }
        log.info("Ended filling department number{}", n);
        return "Data was successfully generated!";
    }
}
