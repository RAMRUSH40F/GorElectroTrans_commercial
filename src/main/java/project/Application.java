package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import project.controller.AttendanceController;

import project.model.Attendance;
import project.model.AttendanceView;
import project.repository.AttendanceRepository;
import project.repository.multiplier.AttendanceMultiplier;

import java.util.List;


@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
        context.getBean("AttendanceRepositoryBean", AttendanceRepository.class);

        ResponseEntity<List<AttendanceView>> attendanceControllerBean = context.getBean("AttendanceControllerBean", AttendanceController.class).
                getAllRecordsAttendance(5, "2", "12");
        System.out.println(attendanceControllerBean);


        context.getBean("AttendanceControllerBean", AttendanceController.class).
                getRecordAttendanceById(5, "01401");


        context.getBean("AttendanceControllerBean", AttendanceController.class).
                updateRecordAttendance(5, new AttendanceView());


        context.getBean("AttendanceControllerBean", AttendanceController.class).
                deleteRecordById(5, "01402");

        context.getBean("AttendanceControllerBean", AttendanceController.class).
                addNewRecordAttendance(5, new Attendance(7, "01402", 1));
    }

}
