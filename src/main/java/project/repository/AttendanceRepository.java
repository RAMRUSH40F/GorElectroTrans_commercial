package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Attendance;

import java.util.HashMap;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AttendanceRepository {

    private final JdbcTemplate jdbcTemplate;

    private final NamedParameterJdbcTemplate namedJdbcTemplate;

    // Метод добавляет запись о результатах посещения какого-то занятия учеником.
    public void addNewRecord(int departmentId, Attendance attendance) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }

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
}
