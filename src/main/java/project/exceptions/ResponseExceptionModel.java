package project.exceptions;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

@Data
@Builder
public class ResponseExceptionModel {
    String message;
    @JsonProperty("http_status")
    HttpStatus httpStatus;
    @JsonProperty("time")
    ZonedDateTime timeStamp;

    @Override
    public String toString() {
        return "This is exception message: " + message + " . Status: " + httpStatus + ". Timestamp:" + timeStamp;
    }

}
