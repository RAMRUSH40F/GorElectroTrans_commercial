package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import project.repository.multiplier.LessonMultiplier;
import project.repository.multiplier.StudentMultiplier;
import project.repository.multiplier.SubDepartmentMultiplier;
import project.repository.multiplier.WorkersMultiplier;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

        context.getBean("LessonMultiplierBean", LessonMultiplier.class).addOneLesson();
//context.getBean("WorkersMultiplierBean", WorkersMultiplier.class).addAllWorkers();
//context.getBean("SubDepartmentBean", SubDepartmentMultiplier.class).addSubDepartments();
        context.getBean("StudentMultiplierBean", StudentMultiplier.class).addNewStudent();
context.close();
    }

}
