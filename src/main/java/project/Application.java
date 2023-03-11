package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import project.repository.SubdepartmentRepository;

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

//        context.getBean("SubdepartmentRepositoryBean", SubdepartmentRepository.class)
//                .getSubDepartmentByName(1,"Коптильня 101");
//        context.close();
    }

}
