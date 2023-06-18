package project.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @TestConfiguration
    public class TestDataSourceConfig {

        @Primary
        @Bean("TestDatasource")
        public DataSource dataSource() {
            return new EmbeddedDatabaseBuilder()
                    .setType(EmbeddedDatabaseType.H2)
                    .addScript("classpath:db_initializer.sql")
                    .build();
        }
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
                () -> Assertions.assertEquals(studentListAfter.size() - 1, studentListBefore.size()),
                () -> Assertions.assertFalse(studentExistsBefore),
                () -> Assertions.assertTrue(studentExistsAfter)
        );
    }


    @Test
    void testH2database() {
        // Configuration
        int depId = 15;
        Subdepartment testSubdepartment = saveTestSubdepartmentAndReturn();
        Student testStudent = createTestStudent();
        testStudent.setSubdepartmentId(null);
        testStudent.setSubdepartmentName(testSubdepartment.getName());

        studentService.addNewStudentByDepId(1, testStudent);
        Pageable pageable = PageRequest.of(1, 999999);
        List<Student> studentListBefore = studentService.findAllWithPagination(depId, pageable).getContent();
        System.out.println(studentListBefore);
        assert studentListBefore.size() != 0;

    }

    // TODO: Обеспечить независимость от того, есть ли studentId, subdepId в БД.
    private Student createTestStudent() {
        return Student.builder()
                .studentId("56122")
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