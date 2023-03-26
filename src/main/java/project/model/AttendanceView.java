package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceView {
    @JsonProperty("name")
    private String name;
    @JsonProperty("lessonId")
    private Integer lessonId;
    @JsonProperty("date")
    private Date date;
    @JsonProperty("studentId")
    private String studentId;
    @JsonProperty("success")
    private int success;
    @JsonProperty("topic")
    private String topic;
    @JsonProperty("duration")
    private Float duration;
    @JsonProperty("teacher")
    private String teacher;
    @JsonProperty("subDepartment")
    private String subDepartment;
}
