package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import project.controller.AttendanceController;
import project.model.Attendance;
import project.repository.AttendanceRepository;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

        //Достать бин
        context.getBean("AttendanceRepositoryBean", AttendanceRepository.class);

        //Достать бин и вызвать метод
//        context.getBean("AttendanceControllerBean", AttendanceController.class).getAllAttendances(5);
//        context.getBean("AttendanceControllerBean", AttendanceController.class).addNewRecordAttendance());
        context.getBean("AttendanceControllerBean", AttendanceController.class).updateRecordAttendance(5, new Attendance());
//        context.close();
    }

}
