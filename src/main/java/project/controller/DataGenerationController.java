package project.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.repository.multiplier.TestDataGenerator;

@RestController
@RequestMapping("/service")
@Slf4j
@Profile("docker")
public class DataGenerationController {
    @Autowired
    private TestDataGenerator testDataGenerator;

    @GetMapping("/all/generateData")
    public String generateData() {
        log.info("Start Filling Data Base, Active Profile is Docker");
        try {
            testDataGenerator.addAllTestData();
        } catch (Exception e) {
            log.error("Exception During Generation", e);
            return "Exception During Generation";
        }
        log.info("Ended filling datasource");
        return "Data was Successfully Generated!";
    }
}
