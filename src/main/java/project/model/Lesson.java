package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
@AllArgsConstructor
public class Lesson {
    private Integer id;
    private String topic;
    private Float duration;
    // Объект класса sql.date
    private Date date;
    private String teacher;
    private int peoplePlanned;
}
