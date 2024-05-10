package project.e2eTests;

import org.junit.jupiter.api.*;
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
import project.model.Lesson;
import project.model.Student;
import project.model.Subdepartment;
import project.security.service.JwtAuthorizationService;
import project.service.LessonServiceImpl;
import project.service.SubdepartmentServiceImpl;
import project.service.reportService.TeacherProfession;

import javax.sql.DataSource;

import java.sql.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LessonApiTest {
    @Autowired
    LessonServiceImpl lessonService;
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    TestRestTemplate restTemplate;
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
    void LessonSavedAndReturned() {
        // Configuration
        int depId = 9;
        Lesson testLesson = createTestLesson();

        // Отключили аунтефикацию
        doNothing().when(jwtAuthorizationService).authorize(anyString(), anyInt());
        ResponseEntity<Lesson> response = restTemplate.postForEntity("/dep_" + depId + "/work_plan/data", testLesson, Lesson.class);

        // Retrieve the saved student from the response body
        Lesson receivedLesson = response.getBody();

        Assertions.assertAll(
                () -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> Assertions.assertEquals(receivedLesson.getTopic(), testLesson.getTopic()),
                () -> Assertions.assertEquals(receivedLesson.getDuration(), testLesson.getDuration()),
                () -> Assertions.assertEquals(receivedLesson.getDate().toLocalDate(), testLesson.getDate().toLocalDate()),
                () -> Assertions.assertEquals(receivedLesson.getTeacher(), testLesson.getTeacher()),
                () -> Assertions.assertEquals(receivedLesson.getPeoplePlanned(), testLesson.getPeoplePlanned()),
                () -> Assertions.assertEquals(receivedLesson.getTeacherPost(), testLesson.getTeacherPost()),
                () -> Assertions.assertEquals(receivedLesson.isHeld(), testLesson.isHeld()),
                () -> Assertions.assertEquals(receivedLesson.getStatus(), testLesson.getStatus()),
                () -> Assertions.assertEquals(receivedLesson.getComment(), null)
        );
    }
    private Lesson createTestLesson(){
        Object[] res = new Object[]{"Ремонт нового подвижного состава трамваев_тест", 2.6f, new Date(1683014400L), "Левицкий Леонид Константинович.", 52, TeacherProfession.MASTER.getProfession()};
        return Lesson.builder()
                .topic((String) res[0])
                .duration((Float) res[1])
                .date((Date) res[2])
                .teacher((String) res[3])
                .peoplePlanned((Integer) res[4])
                .teacherPost((String) res[5])
                .isHeld(true)
                .status(Lesson.Status.HELD)
                .build();
    }
}
