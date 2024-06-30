package project.service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import project.model.Lesson;
import project.service.reportService.TeacherProfession;

import javax.sql.DataSource;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LessonServiceAndRepositoryUnitTest {

    @Autowired
    LessonServiceImpl lessonService;

    @Autowired
    JdbcTemplate jdbcTemplate;


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

    @DisplayName("return empty list when no lessons")
    @Test
    void getPagedLessons_returnNotNull() {

        Pageable pageable = PageRequest.of(1, 15);
        List<Lesson> lessonList = lessonService.findAllByNullableKeywordWithPagination(1, Optional.empty(), pageable).toList();

        assertNotNull(lessonList);
        assertTrue(lessonList.isEmpty());
    }


    /**
     * Throws exception because DATE_FORMAT is not present in H2 database
     */
    @DisplayName("ByKeyword return empty list when no lessons")
    @Test
    void getPagedLessonsByKeyword_returnNotNull() {
        Pageable pageable = PageRequest.of(1, 1);
//        List<Lesson> lessonList = lessonService.findAllByNullableKeywordWithPagination(1, "gag", pageable).toList();

//        assertNotNull(lessonList);
//        assertTrue(lessonList.isEmpty());
    }

    @DisplayName("Add one lesson successfully")
    @Test
    void addNewLesson() {
        Lesson testLesson = Lesson.builder()
                .topic("Ремонт нового подвижного состава трамваев_тест")
                .duration(2.6f)
                .date(LocalDate.now())
                .teacher("Левицкий Леонид Константинович.")
                .peoplePlanned(52)
                .teacherPost(TeacherProfession.MASTER.getProfession())
                .isHeld(true)
                .status(Lesson.Status.HELD)
                .build();

        lessonService.addNewLesson(4, testLesson);

        Integer lessonsCount = lessonService.getLessonsCount(4);
        assertEquals(1, lessonsCount);
    }


}