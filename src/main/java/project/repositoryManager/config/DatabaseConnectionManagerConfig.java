package project.repositoryManager.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DatabaseConnectionManagerConfig {


    private final Map<Short, DataSource> dataSourceMap;

    @Bean
    public Map<Short, LocalContainerEntityManagerFactoryBean> entityManagerFactoryMap() {
        Map<Short, LocalContainerEntityManagerFactoryBean> entityManagerFactoryMap = new HashMap<>();
        for (Map.Entry<Short, DataSource> entry : dataSourceMap.entrySet()) {
            Short databaseId = entry.getKey();
            DataSource dataSource = entry.getValue();
            LocalContainerEntityManagerFactoryBean entityManagerFactory = createEntityManagerFactory(dataSource);
            entityManagerFactoryMap.put(databaseId, entityManagerFactory);
        }
        entityManagerFactoryMap.forEach((a,b) -> {
            System.out.println(b);
        });
        return entityManagerFactoryMap;
    }

    private LocalContainerEntityManagerFactoryBean createEntityManagerFactory(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean entityManagerFactory = new LocalContainerEntityManagerFactoryBean();
        entityManagerFactory.setDataSource(dataSource);
        // Set other Hibernate properties as needed
        return entityManagerFactory;
    }

}