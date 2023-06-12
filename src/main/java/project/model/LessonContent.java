package project.model;

import lombok.*;

import javax.persistence.*;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "lesson_content")
public class LessonContent {
    @Id
    @Column(name = "file_name")
    private String fileName;

    @Column
    private byte[] file;

    @Column(name = "lesson_id")
    private Integer lessonId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LessonContent that = (LessonContent) o;

        return getFileName().equals(that.getFileName());
    }

    @Override
    public int hashCode() {
        return getFileName().hashCode();
    }

    @Override
    public String toString() {
        return "LessonContent{" +
                "fileName='" + fileName + '\'' +
                ", lessonId=" + lessonId +
                '}';
    }
}




