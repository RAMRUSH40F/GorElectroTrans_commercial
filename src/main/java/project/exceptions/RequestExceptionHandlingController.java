package project.exceptions;

import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class RequestExceptionHandlingController {
    @ExceptionHandler(value = {
            InvalidDepartmentException.class,
            InvalidStudentIdException.class,
            PaginationException.class,
            InvalidIntervalException.class,
            InvalidSubdepartmentException.class})
    public ResponseEntity<ResponseExceptionModel> handleInvalidRequestException(RuntimeException e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();

        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    // Security
    @ExceptionHandler(value = {AuthenticationException.class})
    public ResponseEntity<ResponseExceptionModel> authException(RuntimeException e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.UNAUTHORIZED)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {AuthorizationException.class})
    public ResponseEntity<ResponseExceptionModel> authorizationException(RuntimeException e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.FORBIDDEN)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    // Database
    @ExceptionHandler(value = {DataIntegrityViolationException.class})
    public ResponseEntity<ResponseExceptionModel> handleSqlExceptions(RuntimeException e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message("Такие данные не могут быть добавлены. " +
                        "Возможно, они дублируют существующие данные.")
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {
            NoSuchElementException.class,
            IllegalArgumentException.class})
    public ResponseEntity<ResponseExceptionModel> handleNoSuchElementSqlException(RuntimeException e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {FileSizeLimitExceededException.class})
    public ResponseEntity<ResponseExceptionModel> handleFileSizeExceededSqlException(RuntimeException e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message(e.getMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.PAYLOAD_TOO_LARGE)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    // Jpa DataBase exceptions

    @ExceptionHandler(value = {BoundedEntityNotFound.class})
    public ResponseEntity<ResponseExceptionModel> noEntityWithSuchId(BoundedEntityNotFound e) {
        log.warn(e.getLocalizedMessage(), e);
        ResponseExceptionModel responseException = ResponseExceptionModel.builder()
                .message(e.getCustomMessage())
                .timeStamp(ZonedDateTime.now(ZoneId.of("UTC+3")))
                .httpStatus(HttpStatus.BAD_REQUEST)
                .build();
        return new ResponseEntity<>(responseException, responseException.httpStatus);
    }

    @ExceptionHandler(value = {Exception.class})
    public ResponseExceptionModel exceptionHandler(Exception e) {
        log.error(e.getLocalizedMessage(), e);
        return ResponseExceptionModel.builder()
                .message("Произошла ошибка. Перепроверьте свой запрос.")
                .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                .timeStamp(ZonedDateTime.now())
                .build();
    }
}
