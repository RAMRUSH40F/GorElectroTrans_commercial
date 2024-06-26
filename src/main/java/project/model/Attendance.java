package project.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.time.LocalDate;


@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "Attendance")
@IdClass(value = AttendanceId.class)
public class Attendance {

    @Id
    @JsonProperty("studentId")
    @Column(name = "student_id")
    private String studentId;
    @Id
    @Column(name = "lesson_id")
    @JsonProperty("lessonId")
    private Integer lessonId;
    @Column
    @JsonProperty("success")
    private int success;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @Fetch(FetchMode.JOIN)
    @JsonIgnore
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    @Fetch(FetchMode.JOIN)
    @JsonIgnore
    private Student student;

    @JsonGetter("name")
    public String getStudentName() {
        if (student != null) {
            return student.getName();
        } else {
            return null;
        }
    }

    @JsonGetter("topic")
    public String getLessonTopic() {
        if (lesson != null) {
            return lesson.getTopic();
        } else {
            return null;
        }
    }

    @JsonGetter("date")
    public LocalDate getLessonDate() {
        if (lesson != null) {
            return lesson.getDate();
        } else {
            return null;
        }
    }

    @JsonGetter("duration")
    public Float getLessonDuration() {
        if (lesson != null) {
            return lesson.getDuration();
        } else {
            return null;
        }
    }

    @JsonGetter("teacher")
    public String getLessonTeacher() {
        if (lesson != null) {
            return lesson.getTeacher();
        } else {
            return null;
        }
    }


    @JsonGetter("subDepartment")
    public String getSubdepartmentName() {
        if (student != null && student.getSubdepartment() != null) {
            return student.getSubdepartment().getName();
        } else {
            return null;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Attendance that = (Attendance) o;
        return success == that.success && studentId.equals(that.studentId) && lessonId.equals(that.lessonId);
    }

    @Override
    public int hashCode() {
        int result = studentId.hashCode();
        result = 31 * result + lessonId.hashCode();
        result = 31 * result + success;
        return result;
    }

    @Override
    public String toString() {
        return "Attendance{" +
                "studentId='" + studentId + '\'' +
                ", lessonId=" + lessonId +
                ", success=" + success +
                ", lesson=" + lesson +
                ", student=" + student +
                '}';
    }
}