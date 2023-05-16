package repository;


import org.springframework.context.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import project.AppContext;
import project.repository.StudentRepository;
import project.repository.StudentRepositoryImpl;
import project.repository.SubdepartmentRepository;
import project.service.WorkerService;

@Configuration
@ComponentScan("project.repository")
@Import(AppContext.class)
@PropertySource("classpath*: application.properties")
public class StudentRepositoryConfiguration {

    @Bean
    public StudentRepository createStudentRepository(JdbcTemplate jdbcTemplate,
                                                     NamedParameterJdbcTemplate namedParameterJdbcTemplate,
                                                     WorkerService workerService,
                                                     SubdepartmentRepository subdepartmentRepository){
        return new StudentRepositoryImpl(jdbcTemplate,namedParameterJdbcTemplate,subdepartmentRepository, workerService);
    }


}
