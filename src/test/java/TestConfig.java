import org.mariadb.jdbc.MariaDbDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import project.repository.StudentRepository;
import project.repository.StudentRepositoryImpl;
import repository.StudentRepositoryMock;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
@ComponentScan
        (basePackages = {}, excludeFilters = {@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = StudentRepositoryImpl.class)
                })
public class TestConfig {
    @Value("${maria.db.url}")
    private String mariaDbUrl;
    @Value("${maria.db.user}")
    private String mariaDbUser;
    @Value("${maria.db.password}")
    private String mariaDbPassword;

    @Bean
    public StudentRepository studentRepository(JdbcTemplate jdbcTemplate) {
        return new StudentRepositoryMock(jdbcTemplate);
    }

    @Bean("mariaDB")
    public DataSource mariaDataSource() throws SQLException {
        MariaDbDataSource mariaDbDataSource = new MariaDbDataSource();
        mariaDbDataSource.setUrl(mariaDbUrl);
        mariaDbDataSource.setUser(mariaDbUser);
        mariaDbDataSource.setPassword(mariaDbPassword);
        return mariaDbDataSource;
    }

    @Bean
    public JdbcTemplate myJdbcTemplate(DataSource mariaDataSource) {
        return new JdbcTemplate(mariaDataSource);
    }

    @Bean
    public NamedParameterJdbcTemplate myNamedParameterJdbcTemplate(DataSource mariaDataSource) {
        return new NamedParameterJdbcTemplate(mariaDataSource);
    }
}