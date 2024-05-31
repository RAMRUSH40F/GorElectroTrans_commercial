package project.controller.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;

/**
 * При приеме http-запросов обрабатывает их в preHandle
 * Перед выдачей обрабатывает http-ответы в postHandle
 * После выдачи ответа вызывается afterCompletion
 *
 * @author Ramil Rahimkulov (rahimkulov@yoomoney.ru)
 * @since 30.04.2024
 */
@Slf4j
public class HttpRequestFilter implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(shouldLog()){
            logRequest(request);
        }
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler,
                           ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }

    private void logRequest(HttpServletRequest request) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Http request: ")
                .append(request.getMethod())
                .append(request.getRequestURI())
                .append("Parameters={");
        request.getParameterMap().entrySet().forEach(
                        entry -> stringBuilder.append(entry.getKey())
                                .append('=')
                                .append(Arrays.toString(entry.getValue()))
                                .append(','));
        stringBuilder.append('}');
        log.info(stringBuilder.toString());
    }

    private boolean shouldLog() {
        return log.isInfoEnabled();
    }
}