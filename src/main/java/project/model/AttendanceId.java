package project.model;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Getter
@Setter
public class AttendanceId implements Serializable {

    private Integer lessonId;
    private String studentId;


}
