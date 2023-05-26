package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;


@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Table
public class Lesson {

    @JsonProperty("id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column
    @JsonProperty("topic")
    private String topic;
    @JsonProperty("duration")
    @Column
    private Float duration;
    // Объект класса sql.date
    @JsonProperty("date")
    @Column
    private Date date;
    @JsonProperty("teacher")
    @Column
    private String teacher;
    @JsonProperty("teacherPost")
    @Column
    private String teacherPost;
    @Column
    @JsonProperty("peoplePlanned")
    private int peoplePlanned;
    @Column
    @JsonProperty("isHeld")
    private boolean isHeld;


//    @OneToMany (mappedBy="address", fetch=FetchType.EAGER)
    @OneToMany
    @JoinColumn(name = "lesson_id")
    @JsonProperty("lessonContent")
    private Collection<LessonContent> lessonContent;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Lesson lesson = (Lesson) o;

        if (getPeoplePlanned() != lesson.getPeoplePlanned()) return false;
        if (isHeld() != lesson.isHeld()) return false;
        if (!getId().equals(lesson.getId())) return false;
        if (!getTopic().equals(lesson.getTopic())) return false;
        if (!getDuration().equals(lesson.getDuration())) return false;
        if (!getDate().equals(lesson.getDate())) return false;
        if (!getTeacher().equals(lesson.getTeacher())) return false;
        return getTeacherPost().equals(lesson.getTeacherPost());
    }

    @Override
    public int hashCode() {
        int result = getId().hashCode();
        result = 31 * result + getTopic().hashCode();
        result = 31 * result + getDuration().hashCode();
        result = 31 * result + getDate().hashCode();
        result = 31 * result + getTeacher().hashCode();
        result = 31 * result + getTeacherPost().hashCode();
        result = 31 * result + getPeoplePlanned();
        result = 31 * result + (isHeld() ? 1 : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Lesson{" +
                "id=" + id +
                ", topic='" + topic + '\'' +
                ", duration=" + duration +
                ", date=" + date +
                ", teacher='" + teacher + '\'' +
                ", teacherPost='" + teacherPost + '\'' +
                ", peoplePlanned=" + peoplePlanned +
                ", isHeld=" + isHeld +
                '}';
    }
}
