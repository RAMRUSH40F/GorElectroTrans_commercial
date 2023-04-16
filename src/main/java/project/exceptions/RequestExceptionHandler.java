package project.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class RequestExceptionHandler {
    @ExceptionHandler(value = {
            InvalidDepartmentException.class,
            InvalidStudentIdException.class,
            PaginationException.class,
            InvalidIntervalException.class})
    public ResponseEntity<ResponseException> handleInvalidRequestException(RuntimeException e) {
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();

        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }
    @ExceptionHandler(value = {SQLIntegrityConstraintViolationException.class})
    public ResponseEntity<ResponseException> handleSqlExceptions(RuntimeException e){
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message("Такие данные не могут быть добавлены. " +
                        "Возможно, они уже дублируют существующие данные. Если вы загружаете файл, то он должен весить до 14 МБ")
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity<ResponseException> authException(RuntimeException e){
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.FORBIDDEN)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseException exceptionHandler(Exception e){
        System.out.println(e.getCause());
        return ResponseException.builder()
                .message("Произошла ошибка. Перепроверьте свой запрос, или обратитесь к программисту")
                .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                .timeStamp(ZonedDateTime.now())
                .build();
    }
}
