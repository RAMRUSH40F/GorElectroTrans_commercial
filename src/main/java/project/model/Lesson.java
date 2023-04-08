package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;
import java.util.List;

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
    @JsonProperty("teacherPost")
    private String teacherPost;
    @JsonProperty("peoplePlanned")
    private int peoplePlanned;
    @JsonProperty("isHeld")
    private boolean isHeld;
    @JsonProperty("lessonContent")
    private List<String> lessonContents;



}
