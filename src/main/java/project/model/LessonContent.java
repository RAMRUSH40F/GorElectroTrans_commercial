package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonContent {


    private Date date;

    private String topic;

    private Integer lessonId;

    private String fileName;

    private byte[] file;



    public static boolean isEmpty(LessonContent content){
        return content.getFile() != null && content.getLessonId() != null;
    }
}
