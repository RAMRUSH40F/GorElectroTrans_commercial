package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.exceptions.Validator;
import project.model.Attendance;
import project.model.AttendanceView;
import project.model.Lesson;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static project.exceptions.Validator.validateDepartmentId;

@Repository("AttendanceRepositoryBean")
@RequiredArgsConstructor
public class AttendanceRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedJdbcTemplate;

    // Метод добавляет запись о результатах посещения какого-то занятия учеником.
    public AttendanceView addNewRecord(int departmentId, Attendance attendance) {
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
        return getAttendenceView(departmentId, attendance);

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
                        .name(rs.getString("name"))
                        .lessonId(rs.getInt("lesson_id"))
                        .date(rs.getDate("date"))
                        .studentId(rs.getString("student_id"))
                        .success(rs.getInt("success"))
                        .topic(rs.getString("topic"))
                        .duration(rs.getFloat("duration"))
                        .teacher(rs.getString("teacher"))
                        .subDepartment(rs.getString("subdepartment"))
                        .build());
    }

    public AttendanceView getAttendenceView(int departmentId, Attendance attendance) {

        String query = new StringBuilder()
                .append("SELECT * FROM DEP_")
                .append(departmentId)
                .append(".Attendance_view WHERE student_id=")
                .append(attendance.getStudentId())
                .append(" AND lesson_id=")
                .append(attendance.getLessonId())
                .toString();

        try {
            return jdbcTemplate.query(query, (rs, rowNum) ->
                    AttendanceView.builder()
                            .name(rs.getString("name"))
                            .lessonId(rs.getInt("lesson_id"))
                            .date(rs.getDate("date"))
                            .studentId(rs.getString("student_id"))
                            .success(rs.getInt("success"))
                            .topic(rs.getString("topic"))
                            .duration(rs.getFloat("duration"))
                            .teacher(rs.getString("teacher"))
                            .subDepartment(rs.getString("subdepartment"))
                            .build()).get(0);
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }


    public void updateRecordAttendance(int departmentId, Attendance attendance) {
        Map<String, Object> requestParams = new HashMap<>();
        String databaseName = "DEP_" + departmentId;
        requestParams.put("success", attendance.getSuccess());
        requestParams.put("lesson_id", attendance.getLessonId());
        requestParams.put("student_id", attendance.getStudentId());
        String SQL_UPDATE_TEMPLATE = "UPDATE " + databaseName + ".attendance SET success=:success WHERE lesson_id=:lesson_id AND student_id=:student_id";
        namedJdbcTemplate.update(SQL_UPDATE_TEMPLATE, requestParams);
    }

    public void deleteRecordById(int departmentId, Attendance attendance) {
        Map<String, Object> requestParams = new HashMap<>();
        String databaseName = "DEP_" + departmentId;
        requestParams.put("lesson_id", attendance.getLessonId());
        requestParams.put("student_id", attendance.getStudentId());
        String SQL_DELETE_TEMPLATE = "DELETE FROM " + databaseName + ".attendance WHERE lesson_id=:lesson_id AND student_id=:student_id";
        namedJdbcTemplate.update(SQL_DELETE_TEMPLATE, requestParams);
    }

    public Integer getRecordsAttendanceCount(int departmentId) {
        String databaseName = "DEP_" + departmentId;
        return jdbcTemplate.queryForObject("SELECT COUNT(student_id) FROM " +
                databaseName + ".attendance AS COUNT", Integer.class);

    }

    public List<AttendanceView> getRecordsByChars(int departmentId, String key, int page, int size) {
        validateDepartmentId(departmentId);
        Map<String, String> parametrs = new HashMap<>();
        parametrs.put("key", "%" + key + "%");

        List<AttendanceView> records = namedJdbcTemplate.query("SELECT * FROM DEP_" + departmentId + ".Attendance_view WHERE name LIKE :key " +
                "OR date LIKE :key " +
                "OR topic LIKE :key " +
                "OR teacher LIKE :key " +
                "OR subdepartment LIKE :key " +
                "ORDER BY name DESC LIMIT " + ((page - 1) * size) + "," + size, parametrs, new RowMapper<AttendanceView>() {
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
                });
        return records;
    }

}
