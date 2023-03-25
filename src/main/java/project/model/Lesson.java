package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
@AllArgsConstructor
public class Lesson {
    @JsonProperty("id")
    private Integer id;
    @JsonProperty("topic")
    private String topic;
    @JsonProperty("duration")
    private Float duration;
    // Объект класса sql.date
    @JsonProperty("date")
    private Date date;
    @JsonProperty("teacher")
    private String teacher;
    @JsonProperty("peoplePlanned")
    private int peoplePlanned;
}
