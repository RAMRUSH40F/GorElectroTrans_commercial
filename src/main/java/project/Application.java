package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import project.controller.AttendanceController;
import project.repository.AttendanceRepository;
import project.repository.SubdepartmentRepository;
import project.repository.multiplier.*;


@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

        //Достать бин
        context.getBean("AttendanceRepositoryBean", AttendanceRepository.class);

        //Достать бин и вызвать метод
        System.out.println(context.getBean("AttendanceControllerBean", AttendanceController.class).getAllAttendances(5));

//        context.close();
    }

}
