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



        // Заполняем при запуске таблицы студентов тестовыми данными.
        //context.getBean("WorkersMultiplierBean", WorkersMultiplier.class).addAllWorkers();
        //заполняем подразделения
        //context.getBean("SubDepartmentBean", SubDepartmentMultiplier.class).addAllSubDepartments();
        //context.getBean("StudentMultiplierBean", StudentMultiplier.class).addAllStudents();
        //Заполняем при запуске таблицы студентов тестовыми данными.
        
        context.getBean("StudentMultiplierBean", StudentMultiplier.class).addAllStudents();
        context.getBean("LessonMultiplierBean", LessonMultiplier.class).addAllLessons();
        AttendanceMultiplier attendanceMultiplier =
                context.getBean("AttendanceMultiplierBean", AttendanceMultiplier.class);
        for (int i = 1; i <= 15; i++) {
            attendanceMultiplier.addAllAttendance(i);
        }
        context.close();

    }

}
