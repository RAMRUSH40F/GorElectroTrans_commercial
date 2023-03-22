package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonContent {

    private byte[] file;

    private Integer lessonId;

    public static boolean isEmpty(LessonContent content){
        return content.getFile() != null && content.getLessonId() != null;
    }
}
