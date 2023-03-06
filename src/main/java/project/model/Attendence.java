package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Attendence {
    private Integer lessonId;
    private String studentId;
    private byte success;

}