package project.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import project.model.Student;
import project.model.Subdepartment;

import javax.sql.DataSource;
import java.util.List;


@SpringBootTest
class StudentServiceImplIntegrationTest {

    @Autowired
    StudentServiceImpl studentService;

    @Autowired
    SubdepartmentServiceImpl subdepartmentService;

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
    }


    @Test
    void addNewStudentBySubdepartmentNameTest_OneStudentSavedWhenSubdepartmentExists() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());

        Pageable pageable = PageRequest.of(1, 999999);
        List<Student> studentListBefore = studentService.findAllWithPagination(depId, pageable).getContent();
        boolean studentExistsBefore = studentListBefore
                .stream()
                .anyMatch(s -> testStudent.getStudentId().equals(s.getStudentId()));

        studentService.addNewStudentBySubdepartmentName(depId, testStudent);
        List<Student> studentListAfter = studentService.findAllWithPagination(depId, pageable).getContent();

        boolean studentExistsAfter = studentListAfter
                .stream()
                .anyMatch(s -> testStudent.getStudentId().equals(s.getStudentId()));
        Assertions.assertAll(
                () -> Assertions.assertEquals(studentListBefore.size() + 1, studentListAfter.size()),
                () -> Assertions.assertFalse(studentExistsBefore),
                () -> Assertions.assertTrue(studentExistsAfter)
        );
    }

    @Test
    void addNewStudentBySubdepartmentNameTest_ExceptionThrowsWhenStudentAlreadyExists() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());


        studentService.addNewStudentBySubdepartmentName(depId, testStudent);

        Assertions.assertThrows(RuntimeException.class, () -> studentService.addNewStudentBySubdepartmentName(depId, testStudent));

    }


    // TODO: Обеспечить независимость от того, есть ли studentId, subdepId в БД.
    private Student createTestStudent() {
        return Student.builder()
                .studentId("56122")
                .subdepartment(new Subdepartment((short) 121, "SubdepName"))
                .subdepartmentId((short) 121)
                .name("Alex B.")
                .build();
    }

    private Subdepartment saveTestSubdepartmentAndReturn() {
        return subdepartmentService.save(1,
                Subdepartment.builder()
                        .name("SubdepName")
                        .build());
    }
}