package project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import project.exceptions.ResponseException;

import java.time.ZonedDateTime;

@RestControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(value = {Exception.class})
    public ResponseException exceptionHandler(){
        return ResponseException.builder()
                .message("Exception")
                .httpStatus(HttpStatus.FORBIDDEN)
                .timeStamp(ZonedDateTime.now())
                .build();
    }
}
