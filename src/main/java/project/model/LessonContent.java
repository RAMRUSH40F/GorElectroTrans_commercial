package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonContent {

    @ManyToOne(optional=false, cascade= CascadeType.ALL)
    @JoinColumn(name="person_id")
    private Date date;

    @ManyToOne(optional=false, cascade= CascadeType.ALL)
    @JoinColumn(name="person_id")
    private String topic;

    @ManyToOne(optional=false, cascade= CascadeType.ALL)
    @JoinColumn(name="person_id")
    private Integer lessonId;

    private String fileName;

    private byte[] file;



    public static boolean isEmpty(LessonContent content){
        return content.getFile() != null && content.getLessonId() != null;
    }
}
