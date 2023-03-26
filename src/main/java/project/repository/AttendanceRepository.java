package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.exceptions.Validator;
import project.model.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("AttendanceRepositoryBean")
@RequiredArgsConstructor
public class AttendanceRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedJdbcTemplate;

    // Метод добавляет запись о результатах посещения какого-то занятия учеником.
    public void addNewRecord(int departmentId, Attendance attendance) {
        Validator.validateDepartmentId(departmentId);

        String databaseName = "DEP_" + departmentId;
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("lesson_id", attendance.getLessonId());
        parameters.put("student_id", attendance.getStudentId());
        parameters.put("success", attendance.getSuccess());

        namedJdbcTemplate.update(
                "INSERT INTO " + databaseName + ".attendance (lesson_id,student_id,success)" +
                        "VALUES (:lesson_id,:student_id,:success);",
                parameters);

    }


    public List<AttendanceView> getAllRecords(int departmentId, Integer page, Integer pageSize) {
        String query = new StringBuilder()
                .append("SELECT * FROM DEP_")
                .append(departmentId)
                .append(".Attendance_view")
                .append(" ORDER BY lesson_id ASC LIMIT ")
                .append((page - 1) * pageSize)
                .append(",")
                .append(pageSize)
                .toString();
        // rs = возвращаемый из .query объект типа ResultSet
        return jdbcTemplate.query(query, (rs, rowNum) ->
                AttendanceView.builder()
                        .lessonId(rs.getInt("lesson_id"))
                        .studentId(rs.getString("student_id"))
                        .success(rs.getInt("success"))
                        .teacher(rs.getString("teacher"))
                        .build());
    }

    public AttendanceView getRecordAttendanceById(int departmentId, String studentId) {

        String query = new StringBuilder()
                .append("SELECT * FROM DEP_")
                .append(departmentId)
                .append(".Attendance_view WHERE student_id=")
                .append(studentId)
                .toString();

        return jdbcTemplate.query(query, (rs, rowNum) ->
                AttendanceView.builder()
                        .lessonId(rs.getInt("lesson_id"))
                        .studentId(rs.getString("student_id"))
                        .success(rs.getInt("success"))
                        .teacher(rs.getString("teacher"))
                        .build()).get(0);
    }


    public void updateRecordAttendance(int departmentId, AttendanceView attendanceView) {

        String query = new StringBuilder()
                .append("UPDATE DEP_")
                .append(departmentId)
                .append(".Attendence_view SET success=")
                .append(attendanceView.getSuccess())
                .append(" WHERE lesson_id='")
                .append(attendanceView.getLessonId())
                .append("'")
                .toString();

        jdbcTemplate.execute(query);
    }

    public void deleteRecordById(int departmentId, String studentId) {

        String query = new StringBuilder()
                .append("DELETE FROM DEP_")
                .append(departmentId)
                .append(".attendance WHERE student_id=")
                .append(studentId)
                .toString();
        jdbcTemplate.execute(query);
    }

    public Integer getRecordsAttendanceCount(int departmentId) {
        String databaseName = "DEP_" + departmentId;
        return jdbcTemplate.queryForObject("SELECT COUNT(student_id) FROM " +
                databaseName + ".attendance AS COUNT", Integer.class);

    }

}
