package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import project.security.JwtAuthorizationService;


@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
        JwtAuthorizationService service = context.getBean("JwtAuthorizationServiceBean", JwtAuthorizationService.class);
        String jwtToken = service.authenticate("LolsaF", "125125").getValue();
        System.out.println(jwtToken);

        System.out.println(service.validateToken(jwtToken));
        System.out.println(service.decodeUserFromToken(jwtToken));// throws exception
    }

}
