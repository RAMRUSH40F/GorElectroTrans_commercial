package project.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import project.model.projection.LessonContentNoFileProjection;

import javax.persistence.*;
import java.sql.Date;
import java.util.HashSet;
import java.util.Set;
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

    /**
     * Создано новое поле с большим количеством значений {@link Status}
     */
    @Column(name = "isheld")
    @JsonProperty("isHeld")
    @Nullable
    @Deprecated
    private boolean isHeld;

    @Column(name = "status")
    @JsonProperty("status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "comment")
    @JsonProperty("comment")
    @Nullable
    private String comment;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @Fetch(FetchMode.JOIN)
    @JsonIgnore
    @Nullable
    private Set<LessonContentNoFileProjection> lessonContentProjection;

    @JsonGetter("lessonContent")
    @NonNull
    public Set<String> getLessonFileNames() {
        if (lessonContentProjection == null) {
            return new HashSet<>();
        }
        return lessonContentProjection.stream()
                .map(LessonContentNoFileProjection::getFileName)
                .collect(Collectors.toSet());
    }

    @JsonSetter("lessonContent")
    public void setLessonFileNames(Set<String> fileNames) {
        //Receiving Set of fileNames. No actions yet
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Lesson lesson = (Lesson) o;
        return id.equals(lesson.id);
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
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
                ", status=" + status +
                ", lessonFileNames=" + getLessonFileNames() +
                '}';
    }

    public enum Status{
        PLANNED ,
        HELD ,
        CANCELLED ,
        RESCHEDULED
    }
}
