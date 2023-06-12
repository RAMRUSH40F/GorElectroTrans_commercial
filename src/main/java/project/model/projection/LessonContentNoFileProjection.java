package project.model.projection;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "lesson_content")
public class LessonContentNoFileProjection {
    @Id
    @Column(name = "file_name")
    private String fileName;

    @Column(name = "lesson_id")
    private Integer lessonId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LessonContentNoFileProjection that = (LessonContentNoFileProjection) o;

        return getFileName().equals(that.getFileName());
    }

    @Override
    public int hashCode() {
        return getFileName().hashCode();
    }
}
