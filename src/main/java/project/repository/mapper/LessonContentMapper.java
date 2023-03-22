package project.repository.mapper;

import org.springframework.jdbc.core.RowMapper;
import project.model.LessonContent;

import java.sql.ResultSet;
import java.sql.SQLException;

public class LessonContentMapper implements RowMapper<LessonContent> {
    @Override
    public LessonContent mapRow(ResultSet rs, int rowNum) throws SQLException {
        return LessonContent.builder()
                .file(rs.getBytes("file"))
                .lessonId(rs.getInt("lesson_id"))
                .build();
    }
}
