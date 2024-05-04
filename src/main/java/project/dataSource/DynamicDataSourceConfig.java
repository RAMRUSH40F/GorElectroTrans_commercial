package project.dataSource;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DynamicDataSourceConfig {

    @Value("${maria.db.url}")
    private String databaseUrl;

    @Value("${maria.db.user}")
    private String databaseUsername;

    @Value("${maria.db.password}")
    private String databasePassword;

    @SneakyThrows
    @Bean
    public Map<Object, Object> dataSourceMap() {
        Map<Object, Object> dataSourceMap = new HashMap<>();

        int i = 1;
        String databaseName = "DEP_" + i;
        DataSource mariaDbDataSource = createDataSource(databaseName);
        dataSourceMap.put(databaseName, mariaDbDataSource);

        DataSource mariaAuthorisationDataSource = createDataSource("USERS");
        dataSourceMap.put("USERS", mariaAuthorisationDataSource);
        return dataSourceMap;
    }

    private DataSource createDataSource(String databaseName) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.mariadb.jdbc.Driver");
//        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl(databaseUrl + "/" + databaseName);
        dataSource.setUsername(databaseUsername);
        dataSource.setPassword(databasePassword);
        return dataSource;
    }

    @Bean
    public DataSource dataSource() {
        DynamicDataSource dataSource = new DynamicDataSource();
        dataSource.setTargetDataSources(dataSourceMap());


        //dataSource.setDefaultTargetDataSource(dataSourceMap().get("DEP_1")); <- does not influence

        return dataSource;
    }


}
