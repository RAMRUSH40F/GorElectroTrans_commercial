package project.repositoryManager.config;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DataSourceConfig {

    private static final int DATABASE_COUNT = 15;

    @Value("${maria.db.url}")
    private String databaseUrl;

    @Value("${maria.db.user}")
    private String databaseUsername;

    @Value("${maria.db.password}")
    private String databasePassword;

    @SneakyThrows
    @Bean
    public Map<Short, DataSource> dataSourceMap() {
        Map<Short, DataSource> dataSourceMap = new HashMap<>();

        for (short i = 1; i <= DATABASE_COUNT; i++) {
            short databaseName = i;
            DataSource mariaDbDataSource = createDataSource("DEP"+i);
            dataSourceMap.put(databaseName, mariaDbDataSource);
        }
        return dataSourceMap;
    }

    private DataSource createDataSource(String databaseName) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.mariadb.jdbc.Driver");
        dataSource.setUrl(databaseUrl + "/" + databaseName);
        dataSource.setUsername(databaseUsername);
        dataSource.setPassword(databasePassword);
        return dataSource;
    }

}
