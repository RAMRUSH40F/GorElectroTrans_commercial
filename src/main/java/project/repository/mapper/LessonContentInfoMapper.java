package project.repository.mapper;

import org.springframework.jdbc.core.RowMapper;
import project.model.LessonContent;

import java.sql.ResultSet;
import java.sql.SQLException;

public class LessonContentInfoMapper implements RowMapper<LessonContent> {
    @Override
    public LessonContent mapRow(ResultSet rs, int rowNum) throws SQLException {
        return LessonContent.builder()
                .fileName(rs.getString("file_name"))
                .date(rs.getDate("date"))
                .topic(rs.getString("topic"))
                .lessonId(rs.getInt("lesson_id"))
                .build();
    }
}
