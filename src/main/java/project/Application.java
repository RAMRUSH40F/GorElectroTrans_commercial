package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import project.dataSource.DynamicDataSourceContextHolder;


@SpringBootApplication
@EnableAspectJAutoProxy
public class Application {

    public static void main(String[] args) {
        DynamicDataSourceContextHolder.setCurrentDataSource("sys");
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
    }
}
