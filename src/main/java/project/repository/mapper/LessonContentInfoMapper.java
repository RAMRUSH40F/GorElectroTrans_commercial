package project.repository.mapper;

import org.springframework.jdbc.core.RowMapper;
import project.model.LessonContent;

import java.sql.ResultSet;
import java.sql.SQLException;

@Deprecated
public class LessonContentInfoMapper implements RowMapper<LessonContent> {
    @Override
    public LessonContent mapRow(ResultSet rs, int rowNum) throws SQLException {
        return LessonContent.builder()
                .fileName(rs.getString("file_name"))
                .lessonId(rs.getInt("lesson_id"))
                .build();
    }
}
