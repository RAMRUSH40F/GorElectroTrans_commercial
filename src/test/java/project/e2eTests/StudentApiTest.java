package project.e2eTests;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import project.model.Student;
import project.model.Subdepartment;
import project.model.projection.StudentIdName;
import project.security.service.JwtAuthorizationService;
import project.service.StudentServiceImpl;
import project.service.SubdepartmentServiceImpl;

import javax.sql.DataSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.DEFINED_PORT;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class StudentApiTest {

    @Autowired
    SubdepartmentServiceImpl subdepartmentService;
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    TestRestTemplate restTemplate;
    @Autowired
    StudentServiceImpl studentServiceImpl;

    @MockBean
    JwtAuthorizationService jwtAuthorizationService;

    @TestConfiguration
    public static class TestDataSourceConfig {

        @Primary
        @Bean("TestDatasource")
        public DataSource dataSource() {
            return new EmbeddedDatabaseBuilder()
                    .setType(EmbeddedDatabaseType.H2)
                    .addScript("classpath:db_initializer.sql")
                    .build();
        }

    }

    @BeforeEach
    void cleanDatabase() {


        // Clean the student table
        jdbcTemplate.execute("DELETE FROM student");

        // Clean the subdepartment table
        jdbcTemplate.execute("DELETE FROM subdepartment");

        // Clean the lesson table
        jdbcTemplate.execute("DELETE FROM lesson");

        // Clean the attendance table
        jdbcTemplate.execute("DELETE FROM attendance");
    }

    @AfterAll
    void deleteSchema() {
        jdbcTemplate.execute("DROP VIEW Attendance_view");
        jdbcTemplate.execute("DROP VIEW Materials_view");
        jdbcTemplate.execute("DROP TABLE lesson");
        jdbcTemplate.execute("DROP TABLE authorities");
        jdbcTemplate.execute("DROP TABLE users");
        jdbcTemplate.execute("DROP TABLE subdepartment");
        jdbcTemplate.execute("DROP TABLE student");
        jdbcTemplate.execute("DROP TABLE attendance");
        jdbcTemplate.execute("DROP TABLE lesson_content");

    }

    @Test
    void StudentSavedAndReturned() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());

        // Отключили аунтефикацию
        doNothing().when(jwtAuthorizationService).authorize(anyString(), anyInt());

        ResponseEntity<Student> response = restTemplate.postForEntity("/dep_" + depId + "/students/data", testStudent, Student.class);

        // Retrieve the saved student from the response body
        Student receivedStudent = response.getBody();


        Assertions.assertAll(
                () -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED),
                () -> Assertions.assertEquals(receivedStudent.getStudentId(), testStudent.getStudentId()),
                () -> Assertions.assertEquals(receivedStudent.getName(), testStudent.getName()),
                () -> Assertions.assertEquals(receivedStudent.getSubdepartmentName(), testStudent.getSubdepartmentName())
        );
    }

    /**
     * Тестируем api поиска студентов по имени
     */
    @Test
    void testFindByName() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());
        studentServiceImpl.addNewStudentBySubdepartmentName(9, testStudent);

        // Отключили аунтефикацию
        doNothing().when(jwtAuthorizationService).authorize(anyString(), anyInt());

        ResponseEntity<StudentIdName[]> response = restTemplate.getForEntity("/dep_" + depId + "/students/getByName?key=Арте&limit=7", StudentIdName[].class);

        // Retrieve the saved student from the response body
        StudentIdName receivedStudent = response.getBody()[0];
        Assertions.assertAll(
                () -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> Assertions.assertEquals(receivedStudent.getStudentId(), testStudent.getStudentId()),
                () -> Assertions.assertEquals(receivedStudent.getName(), testStudent.getName())
        );

        ResponseEntity<StudentIdName[]> response2 = restTemplate.getForEntity("/dep_" + depId + "/students/getByName?key=алекс&limit=7", StudentIdName[].class);
        StudentIdName receivedStudent2 = response.getBody()[0];

        Assertions.assertAll(
                () -> assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> Assertions.assertEquals(receivedStudent2.getStudentId(), testStudent.getStudentId()),
                () -> Assertions.assertEquals(receivedStudent2.getName(), testStudent.getName())
        );

        ResponseEntity<StudentIdName[]> response3 = restTemplate.getForEntity("/dep_" + depId + "/students/getByName?key=ложный&limit=7", StudentIdName[].class);

        Assertions.assertAll(
                () -> assertThat(response3.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> Assertions.assertEquals(response3.getBody().length, 0)
        );

    }


    private Student createTestStudent() {
        return Student.builder()
                .studentId("56122")
                .subdepartment(new Subdepartment((short) 121, "SubdepName"))
                .subdepartmentId((short) 121)
                .name("Александров Артем Валерьевич")
                .build();
    }

    private Subdepartment saveTestSubdepartmentAndReturn() {
        return subdepartmentService.save(1,
                Subdepartment.builder()
                        .name("SubdepName")
                        .build());
    }
}