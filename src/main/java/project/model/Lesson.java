package project.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import project.model.projection.LessonContentNoFileProjection;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;


@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter

@Entity
@Table
public class Lesson {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer id;

    @Column
    @JsonProperty("topic")
    private String topic;

    @Column
    @JsonProperty("duration")
    private Float duration;

    @Column
    @JsonProperty("date")
    private Date date;

    @Column
    @JsonProperty("teacher")
    private String teacher;

    @Column(name = "teacherpost")
    @JsonProperty("teacherPost")
    private String teacherPost;

    @Column(name = "people_planned")
    @JsonProperty("peoplePlanned")
    private int peoplePlanned;

    @Column(name = "isheld")
    @JsonProperty("isHeld")
    private boolean isHeld;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @Fetch(FetchMode.JOIN)
    private List<LessonContentNoFileProjection> lessonContentProjection;

    @JsonGetter("lessonContent")
    public List<String> getLessonFileNames() {
        return lessonContentProjection.stream()
                .map(LessonContentNoFileProjection::getFileName)
                .collect(Collectors.toList());
    }

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
                ", lessonFileNames=" + getLessonFileNames() +
                '}';
    }
}
