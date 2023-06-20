package project.security;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import project.security.model.User;
import project.security.service.JwtAuthorizationService;

import javax.sql.DataSource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class JwtAuthorizationServiceUnitTest {

    @Autowired
    JwtAuthorizationService service;

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


    @DisplayName("Validate valid token")
    @Test
    void testValidateToken_validToken() {
        //Credentials of user with authority 1 from H2 database initial script
        String username = "EthanHo";
        String password = "12345678";

        String token = service.authenticate(User.builder().username(username).password(password).build());

        assertDoesNotThrow(() -> service.validateToken(token));
    }


    @DisplayName("Validate expired token")
    @Test
    void testValidateToken_expiredToken() {

        //Credentials of user with authority 1 from H2 database initial script
        String username = "EthanHo";
        String password = "12345678";

        String token = service.authenticate(User.builder().username(username).password(password).build());


        // Состарить токен как-то

//        assertThrows(RuntimeException.class, () -> service.validateToken(token));
    }


    @DisplayName("Validate invalid token, disabledUser")
    @Test
    void testValidateToken_tokenOfDisabledPerson() {
        //Credentials of user with authority 14 from H2 database initial script
        String username = "JamesLiu";
        String password = "letmein123";

        String token = service.authenticate(User.builder().username(username).password(password).build());
        jdbcTemplate.execute("UPDATE users SET enabled=0 WHERE username='" + username + "'");

        assertFalse(service.validateToken(token));

    }

    @Test
    void authenticate_returnsNonNullJwtWhenRightCredentials() {
        //Configuration
        //Admin Credentials from H2 database initial script
        User adminUser = User.builder().username("LolsaF").password("125125").build();

        String token = service.authenticate(adminUser);

        User decodedUserFromToken = service.decodeUserFromToken(token);
        assertAll(
                () -> assertFalse(token.isEmpty()),
                () -> assertTrue(decodedUserFromToken.getAuthorities().contains("100")),
                () -> assertEquals(adminUser.getUsername(), decodedUserFromToken.getUsername())
        );
    }

    @DisplayName("Throws exception when User is Disabled In Database")
    @Test
    void authenticate_() {
        //Configuration
        //Credentials of disabled user from H2 database initial script
        User adminUser = User.builder().username("AvaWang").password("password123").build();

        assertThrows(RuntimeException.class, () -> service.authenticate(adminUser));
    }

    @DisplayName("Authorize to authority 1 with authority 1 and not for others")
    @Test
    void authorize() {
        //Credentials of user with authority 1 from H2 database initial script
        String token = service.authenticate(User.builder().username("EthanHo").password("12345678").build());

        for (int i = 2; i <= 15; i++) {
            int i_ = i;
            assertThrows(RuntimeException.class, () -> service.authorize(token, i_));
        }
        assertThrows(RuntimeException.class, () -> service.authorize(token, 100));
        assertDoesNotThrow(() -> service.authorize(token, 1));

    }

    @Test
    void validateToken() {
    }

    @Test
    void decodeUserFromToken() {
    }
}