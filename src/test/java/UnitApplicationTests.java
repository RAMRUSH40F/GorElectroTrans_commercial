import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import project.model.StudentView;
import project.repository.StudentRepository;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@ContextConfiguration(classes = TestConfig.class)
public class UnitApplicationTests {


    @Autowired
    StudentRepository studentRepository;


    // Unit testing
    @Test
    public void mockTestEmployeeFullInfoService() {
        StudentView employeeFullInfo = studentRepository.getStudentById(1, "00001");
        System.out.println(employeeFullInfo);
    }


}

