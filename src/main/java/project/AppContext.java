package project;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
public class AppContext {


    @Bean
    public JdbcTemplate myJdbcTemplate(DataSource mariaDbDynamicDataSource) {
        return new JdbcTemplate(mariaDbDynamicDataSource);
    }

    @Bean
    public NamedParameterJdbcTemplate myNamedParameterJdbcTemplate(DataSource mariaDbDynamicDataSource) {
        return new NamedParameterJdbcTemplate(mariaDbDynamicDataSource);
    }

    /**
     * This configuration allows Cross-Origin Resource Sharing (CORS)
     * Разкомментить, если фронт-энд ведет разработку на другом сервере нежели сервер с эндпоинтами
     */
    @Bean
    public WebMvcConfigurer corsConfigurer()
    {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOriginPatterns("*")
                        .allowedHeaders("*")
                        .exposedHeaders("students_count","lessons_count","attendance_count","content_count", "Authorization");
            }
        };
    }

}
