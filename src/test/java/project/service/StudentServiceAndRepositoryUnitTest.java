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
import project.exceptions.InvalidSubdepartmentException;
import project.model.Student;
import project.model.Subdepartment;

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.getCurrentDataSource;


@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class StudentServiceAndRepositoryUnitTest {

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
    void findAllWithPagination_getsRightAmountFromRightDatabase() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());

        studentService.addNewStudentBySubdepartmentName(depId, testStudent);
        Pageable pageable = PageRequest.of(1, 999999);
        List<Student> studentListAfter = studentService.findAllWithPagination(depId, Optional.empty(), pageable).getContent();


        Assertions.assertAll(
                () -> Assertions.assertEquals(1, studentListAfter.size()),
                () -> Assertions.assertEquals("DEP_" + depId, getCurrentDataSource())
        );
    }

    @Test
    void findAllWithPagination_getsEmptyListWhenNoStudents() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());

        Pageable pageable = PageRequest.of(1, 999999);
        List<Student> studentListAfter = studentService.findAllWithPagination(depId, Optional.empty(), pageable).getContent();

        Assertions.assertEquals(0, studentListAfter.size());
    }


    // OK CASES
    @Test
    void addNewStudentBySubdepartmentNameTest_OneStudentSavedWhenSubdepartmentExists() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());

        Pageable pageable = PageRequest.of(1, 999999);
        List<Student> studentListBefore = studentService.findAllWithPagination(depId, Optional.empty(), pageable).getContent();
        boolean studentExistsBefore = studentListBefore
                .stream()
                .anyMatch(s -> testStudent.getStudentId().equals(s.getStudentId()));

        studentService.addNewStudentBySubdepartmentName(depId, testStudent);
        List<Student> studentListAfter = studentService.findAllWithPagination(depId, Optional.empty(), pageable).getContent();

        boolean studentExistsAfter = studentListAfter
                .stream()
                .anyMatch(s -> testStudent.getStudentId().equals(s.getStudentId()));
        Assertions.assertAll(
                () -> Assertions.assertEquals(studentListBefore.size() + 1, studentListAfter.size()),
                () -> Assertions.assertFalse(studentExistsBefore),
                () -> Assertions.assertTrue(studentExistsAfter)
        );
    }

    // NOT OK CASES
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

    @Test
    void addNewStudentBySubdepartmentNameTest_ExceptionThrowsWhenSubdepNameDoesNotExist() {
        // Configuration
        int depId = 9;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());
        jdbcTemplate.execute("DELETE FROM subdepartment");


        Assertions.assertThrows(InvalidSubdepartmentException.class, () -> studentService.addNewStudentBySubdepartmentName(depId, testStudent));

    }

    @Test
    void addNewStudentBySubdepartmentNameTest_ExceptionThrowsWhenSubdepNameNull() {
        // Configuration
        int depId = 9;
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(null);
        jdbcTemplate.execute("DELETE FROM subdepartment");


        Assertions.assertThrows(InvalidSubdepartmentException.class, () -> studentService.addNewStudentBySubdepartmentName(depId, testStudent));

    }


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