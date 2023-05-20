package project.repositoryManager;

import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.data.repository.core.support.RepositoryFactorySupport;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

public class DynamicEntityManagerRepositoryFactory {

    private final LocalContainerEntityManagerFactoryBean entityManagerFactory;

    public DynamicEntityManagerRepositoryFactory(LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public <T> T createRepository(Class<T> repositoryInterface) {
        RepositoryFactorySupport factory = new JpaRepositoryFactory(entityManagerFactory.getObject().createEntityManager());
        return factory.getRepository(repositoryInterface);
    }
}
