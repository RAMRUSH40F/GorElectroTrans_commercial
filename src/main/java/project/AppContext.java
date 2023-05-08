package project;

import lombok.RequiredArgsConstructor;
import org.mariadb.jdbc.MariaDbDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
@RequiredArgsConstructor
public class AppContext {

    @Value("${maria.db.url}")
    private String mariaDbUrl;
    @Value("${maria.db.user}")
    private String mariaDbUser;
    @Value("${maria.db.password}")
    private String mariaDbPassword;


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

    /**
     * This configuration allows Cross-Origin Resource Sharing (CORS)
     * Разкомментить, если фронт-энд ведет разработку на другом сервере нежели сервер с эндпоинтами
     */
//    @Bean
//    public WebMvcConfigurer corsConfigurer()
//    {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE")
//                        .allowedOriginPatterns("*")
//                        .allowedHeaders("*")
//                        .exposedHeaders("students_count","lessons_count","attendance_count","content_count", "Authorization");
//            }
//        };
//    }

}
