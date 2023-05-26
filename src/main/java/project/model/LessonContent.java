package project.model;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class LessonContent {

    private String fileName;
    private byte[] file;

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




