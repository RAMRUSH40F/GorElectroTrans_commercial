package project.repositoryManager.config;

import lombok.RequiredArgsConstructor;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import project.repository.SubdepartmentJpaRepository;
import project.repositoryManager.DynamicEntityManagerRepositoryFactory;

import java.util.HashMap;
import java.util.Map;


// Not in use at the moment
//@Configuration
@RequiredArgsConstructor
public class SubdepartmentRepositoryConfig {

    private final Map<Short, LocalContainerEntityManagerFactoryBean> entityManagerFactoryMap;

//    @Bean
    public Map<Short, SubdepartmentJpaRepository> subdepartmentJpaRepositoryMap() {
        Map<Short, SubdepartmentJpaRepository> subdepartmentJpaRepositoryMap = new HashMap<>();
        for (Map.Entry<Short, LocalContainerEntityManagerFactoryBean> entry : entityManagerFactoryMap.entrySet()) {
            Short databaseNumber = entry.getKey();
            LocalContainerEntityManagerFactoryBean entityManager = entry.getValue();

            // LOOK AT CASTING may not work
            DynamicEntityManagerRepositoryFactory repositoryFactory = new DynamicEntityManagerRepositoryFactory(entityManager);
            SubdepartmentJpaRepository subdepartmentRepository = repositoryFactory.createRepository(SubdepartmentJpaRepository.class);
            subdepartmentJpaRepositoryMap.put(databaseNumber, subdepartmentRepository);
        }
        return subdepartmentJpaRepositoryMap;
    }


}
