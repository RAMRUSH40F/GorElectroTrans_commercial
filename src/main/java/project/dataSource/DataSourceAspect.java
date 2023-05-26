package project.dataSource;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Component
@Aspect
public class DataSourceAspect {

    @Before("execution(* project.service.WorkerService.*(..))")
    public void changeDataSourceToWorker() {
        setCurrentDataSource("WORKERS");
    }


}
