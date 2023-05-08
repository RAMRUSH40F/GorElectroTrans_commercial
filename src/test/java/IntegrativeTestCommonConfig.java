import org.mariadb.jdbc.MariaDbDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import project.repository.StudentRepository;
import repository.mocks.StudentRepositoryMock;

import javax.sql.DataSource;
import java.sql.SQLException;

//@ComponentScan
//        (basePackages = {}, excludeFilters = {@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = StudentRepositoryImpl.class)
//        })

@Configuration
@Profile("test")
public class IntegrativeTestCommonConfig {
    @Value("${maria.db.url}")
    private String mariaDbUrl;
    @Value("${maria.db.user}")
    private String mariaDbUser;
    @Value("${maria.db.password}")
    private String mariaDbPassword;

    @Primary
    @Bean
    public StudentRepository studentRepository(JdbcTemplate jdbcTemplate) {
        return new StudentRepositoryMock(jdbcTemplate);
    }

    @Primary
    @Bean("mariaDB")
    public DataSource mariaDataSource() throws SQLException {
        MariaDbDataSource mariaDbDataSource = new MariaDbDataSource();
        mariaDbDataSource.setUrl(mariaDbUrl);
        mariaDbDataSource.setUser(mariaDbUser);
        mariaDbDataSource.setPassword(mariaDbPassword);
        return mariaDbDataSource;
    }

    @Primary
    @Bean
    public JdbcTemplate myJdbcTemplate(DataSource mariaDataSource) {
        return new JdbcTemplate(mariaDataSource);
    }

    @Primary
    @Bean
    public NamedParameterJdbcTemplate myNamedParameterJdbcTemplate(DataSource mariaDataSource) {
        return new NamedParameterJdbcTemplate(mariaDataSource);
    }
}