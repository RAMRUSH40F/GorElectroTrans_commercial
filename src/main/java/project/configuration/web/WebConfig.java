package project.configuration.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Включить логирование запросов spring
 *
 * @author Ramil Rahimkulov (rahimkulov@yoomoney.ru)
 * @since 30.04.2024
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HttpRequestFilter());
    }

    /**
     * This configuration allows Cross-Origin Resource Sharing (CORS)
     * Разкомментить, если фронт-энд ведет разработку на другом сервере нежели сервер с эндпоинтами
     */
    @Bean
    public WebMvcConfigurer corsConfigurer()
    {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOriginPatterns("*")
                        .allowedHeaders("*")
                        .exposedHeaders("students_count","lessons_count","attendance_count","content_count", "Authorization");
            }
        };
    }

}
