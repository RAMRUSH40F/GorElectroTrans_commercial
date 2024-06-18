package project.model;

import lombok.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter

@Entity
@Immutable
@Table(name = "Attendance_view")
@IdClass(AttendanceId.class)
@Deprecated
public class AttendanceView implements Serializable {
    @Id
    @Column
    private String studentId;
    @Id
    @Column
    private Integer lessonId;
    @Column(name = "name")
    private String studentName;
    @Column
    private Date date;
    @Column
    private boolean success;
    @Column
    private String topic;
    @Column
    private double duration;
    @Column
    private String teacher;
@Column
    private String subdepartment;


}
