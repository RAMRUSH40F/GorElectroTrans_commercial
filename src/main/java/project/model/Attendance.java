package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Attendance {
    private Integer lessonId;
    private String studentId;
    private int success;

}