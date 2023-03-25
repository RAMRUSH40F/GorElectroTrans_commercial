package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceView {
    @JsonProperty("lessonId")
    private Integer lessonId;
    @JsonProperty("studentId")
    private String studentId;
    @JsonProperty("success")
    private int success;
    @JsonProperty("teacher")
    private String teacher;
}
