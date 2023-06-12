package temporaryFiles;


import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import project.AppContext;

@Configuration
@ComponentScan("project.repository")
@Import(AppContext.class)
@PropertySource("classpath*: application.properties")
public class StudentRepositoryConfiguration {



}
