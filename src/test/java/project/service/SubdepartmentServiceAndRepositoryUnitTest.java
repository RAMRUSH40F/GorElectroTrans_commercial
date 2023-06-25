package project.service;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import project.model.Subdepartment;

import javax.sql.DataSource;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SubdepartmentServiceAndRepositoryUnitTest {

    @Autowired
    SubdepartmentServiceImpl service;

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

    @DisplayName("return empty list when no lessons")
    @Test
    void findAll_returnNotNull() {
        int departmentId = 1;
        List<Subdepartment> lessonList = service.findAll(departmentId);

        assertNotNull(lessonList);
        assertTrue(lessonList.isEmpty());
    }


    @DisplayName("no deletion when no lessons")
    @Test
    void deleteById_NotThrowsOnNotExistingId() {
        int departmentId = 2;
        short notExistingId = 222;


        Assertions.assertAll(
                () -> assertDoesNotThrow(() -> service.deleteById(departmentId, notExistingId)),
                () -> assertFalse(service.deleteById(departmentId, notExistingId))
        );
    }

    @DisplayName("deleted on existing subdep")
    @Test
    void deleteById_notThrowsOnExistingId() {
        short departmentId = 3;
        Subdepartment subdepartment = saveTestSubdepartmentAndReturn();

        short subdepartmentId = subdepartment.getId();
        boolean isDeleted = service.deleteById(departmentId, subdepartmentId);

        assertTrue(isDeleted);
    }

    @DisplayName("updating correctly")
    @Test
    void updateName_correctlySaved() {

        short departmentId = 4;
        Subdepartment subdepartment = saveTestSubdepartmentAndReturn();
        String newName = subdepartment.getName() + "...";
        subdepartment.setName(newName);


        Subdepartment subdepartment1 = service.updateName(departmentId, subdepartment);

        assertEquals(newName, subdepartment1.getName());
    }

    @DisplayName("Throws on saving when subdepartment already exists")
    @Test
    void save_doubleSaveNotThrows() {
        short departmentId = 5;
        Subdepartment notExistingSubdepartment = getNotExistingSubdepartment();
        service.save(departmentId, notExistingSubdepartment);

        assertThrows(RuntimeException.class, () -> service.save(departmentId, notExistingSubdepartment));

    }

    private Subdepartment saveTestSubdepartmentAndReturn() {
        return service.save(1,
                Subdepartment.builder()
                        .name("SubdepName")
                        .build());
    }

    private static Subdepartment getNotExistingSubdepartment() {
        return new Subdepartment((short) 220, "TestSubDep");
    }
}