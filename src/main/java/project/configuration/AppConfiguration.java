package project.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import project.configuration.web.WebConfig;
import project.repository.multiplier.TestDataGenerator;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
@Import(value = {WebConfig.class})
public class AppConfiguration {


    @Bean
    public JdbcTemplate myJdbcTemplate(DataSource mariaDbDynamicDataSource) {
        return new JdbcTemplate(mariaDbDynamicDataSource);
    }

    @Bean
    public NamedParameterJdbcTemplate myNamedParameterJdbcTemplate(DataSource mariaDbDynamicDataSource) {
        return new NamedParameterJdbcTemplate(mariaDbDynamicDataSource);
    }
}
