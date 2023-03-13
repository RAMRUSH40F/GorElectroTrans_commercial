package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import project.repository.SubdepartmentRepository;
import project.repository.multiplier.*;


@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

        //success
        //context.getBean("SubDepartmentBean", SubdepartmentMultiplier.class).addAllSubDepartments();

        AttendanceMultiplier attendanceMultiplier =
                context.getBean("AttendanceMultiplierBean", AttendanceMultiplier.class);
        StudentMultiplier studentMultiplier = context.getBean("StudentMultiplierBean", StudentMultiplier.class);


        for (int i = 2; i <= 15; i++) {
            //success
            //context.getBean("LessonMultiplierBean", LessonMultiplier.class).addAllLessons(i);

            //success
            //studentMultiplier.addAllStudents(i);

            //success
            //attendanceMultiplier.addAllAttendance(i);

        }
        context.close();

    }

}
