package project.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import project.security.exception.AuthenticationException;
import project.security.exception.AuthorizationException;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.NoSuchElementException;

@ControllerAdvice
public class RequestExceptionHandlingController {
    @ExceptionHandler(value = {
            InvalidDepartmentException.class,
            InvalidStudentIdException.class,
            PaginationException.class,
            InvalidIntervalException.class,
            InvalidSubdepartmentException.class})
    public ResponseEntity<ResponseException> handleInvalidRequestException(RuntimeException e) {
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();

        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {DataIntegrityViolationException.class})
    public ResponseEntity<ResponseException> handleSqlExceptions(RuntimeException e) {
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message("Такие данные не могут быть добавлены. " +
                        "Возможно, они уже дублируют существующие данные.")
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {NoSuchElementException.class, IllegalArgumentException.class})
    public ResponseEntity<ResponseException> handleNoSuchStudentSqlException(RuntimeException e) {
        System.out.println(e.getMessage());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {FileSizeLimitExceededException.class})
    public ResponseEntity<ResponseException> handleFileSizeExceededSqlException(RuntimeException e) {
        System.out.println(e.getMessage());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.PAYLOAD_TOO_LARGE)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity<ResponseException> authException(RuntimeException e) {
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.UNAUTHORIZED)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {AuthorizationException.class})
    public ResponseEntity<ResponseException> authorizationException(RuntimeException e) {
        System.out.println(e.getCause());
        ResponseException responseException = ResponseException.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.FORBIDDEN)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseException exceptionHandler(Exception e) {
        System.out.println(e.getCause());
        return ResponseException.builder()
                .message("Произошла ошибка. Перепроверьте свой запрос.")
                .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                .timeStamp(ZonedDateTime.now())
                .build();
    }
}