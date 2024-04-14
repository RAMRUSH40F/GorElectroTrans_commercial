package project.service;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
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
import project.dataSource.DynamicDataSourceContextHolder;
import project.model.Lesson;
import project.service.reportService.TeacherProfession;

import javax.sql.DataSource;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LessonServiceTest {

    @Autowired
    LessonServiceImpl lessonService;
    @Autowired
    JdbcTemplate jdbcTemplate;

    @BeforeAll
    static void setDataBaseToCancelException() {
        DynamicDataSourceContextHolder.setCurrentDataSource("DEP_1");
    }

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
        jdbcTemplate.execute("DROP VIEW IF EXISTS Attendance_view");
        jdbcTemplate.execute("DROP VIEW IF EXISTS  Materials_view");
        jdbcTemplate.execute("DROP TABLE IF EXISTS  attendance");
        jdbcTemplate.execute("DROP TABLE IF EXISTS lesson_content");
        jdbcTemplate.execute("DROP TABLE IF EXISTS  lesson");
        jdbcTemplate.execute("DROP TABLE IF EXISTS  authorities");
        jdbcTemplate.execute("DROP TABLE IF EXISTS  users");
        jdbcTemplate.execute("DROP TABLE IF EXISTS student");
        jdbcTemplate.execute("DROP TABLE IF EXISTS  subdepartment");

    }


    @Test
    void getPagedLessons_returnNotNull() {
        Pageable pageable = PageRequest.of(1, 15);
        List<Lesson> lessonList = lessonService.findAllByNullableKeywordWithPagination(1, Optional.empty(), pageable).toList();
        System.out.println(lessonList);

        assertNotNull(lessonList);

    }

    @Test
    void getLessonsCount_returnNoNull() {
        Integer num = lessonService.getLessonsCount(1);

        assertNotNull(num);
    }

    @Test
    void getLessonByKeyword_returnNotNull() {
        Pageable pageable = PageRequest.of(1, 1);
        List<Lesson> lessonList = lessonService.findAllByNullableKeywordWithPagination(1, Optional.empty(), pageable).toList();
        System.out.println(lessonList);

        assertNotNull(lessonList);
    }


    @Test
    void addNewLesson_lessonCountPlusOneResult() {
        Integer num = lessonService.getLessonsCount(4);
        Object[] res = new Object[]{"Ремонт нового подвижного состава трамваев_тест", 2.6f, new Date(1683014400L), "Левицкий Леонид Константинович.", 52, TeacherProfession.MASTER.getProfession()};

        lessonService.addNewLesson(4,
                Lesson.builder()
                        .topic((String) res[0])
                        .duration((Float) res[1])
                        .date((Date) res[2])
                        .teacher((String) res[3])
                        .peoplePlanned((Integer) res[4])
                        .teacherPost((String) res[5])
                        .isHeld(true).build());

        Integer num2 = lessonService.getLessonsCount(4);
        assertTrue(num < num2);
    }


}