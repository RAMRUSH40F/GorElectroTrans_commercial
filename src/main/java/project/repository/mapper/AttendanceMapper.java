package project.repository.mapper;

import org.springframework.jdbc.core.RowMapper;
import project.model.AttendanceView;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AttendanceMapper implements RowMapper<AttendanceView>{
    @Override
    public AttendanceView mapRow(ResultSet rs, int rowNum) throws SQLException {
        return AttendanceView.builder()
                .name(rs.getString("name"))
                .lessonId(rs.getInt("lesson_id"))
                .date(rs.getDate("date"))
                .studentId(rs.getString("student_id"))
                .success(rs.getInt("success"))
                .topic(rs.getString("topic"))
                .duration(rs.getFloat("duration"))
                .teacher(rs.getString("teacher"))
                .subDepartment(rs.getString("subdepartment"))
                .build();
    }
}

