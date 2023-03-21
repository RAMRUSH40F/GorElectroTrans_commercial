package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;
import project.exceptions.InvalidDepartmentException;
import project.model.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class AttendanceRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    NamedParameterJdbcTemplate namedJdbcTemplate;

    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    StudentRepository studentRepository;

    // Метод добавляет запись о результатах посещения какого-то занятия учеником.
//    public void addNewRecord(int departmentId, Attendance attendance) {
//        if (departmentId > 15 || departmentId < 1) {
//            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
//        }
//
//        String databaseName = "DEP_" + departmentId;
//        Map<String, Object> parameters = new HashMap<>();
//        parameters.put("lesson_id", attendance.getLessonId());
//        parameters.put("student_id", attendance.getStudentId());
//        parameters.put("success", attendance.getSuccess());
//
//        namedJdbcTemplate.update(
//                "INSERT INTO " + databaseName + ".attendance (lesson_id,student_id,success)" +
//                        "VALUES (:lesson_id,:student_id,:success);",
//                parameters);
//    }

    public List<AttendanceView> getAllAttendances(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;
        List<AttendanceView> listAttendance = jdbcTemplate.query("SELECT * FROM " + databaseName + ".attendance", new RowMapper<AttendanceView>() {
            @Override
            public AttendanceView mapRow(ResultSet rs, int rowNum) throws SQLException {
                return AttendanceView.builder()
                        .lessonId(rs.getInt("lesson_id"))
                        .studentId(rs.getString("student_id"))
                        .success(rs.getInt("success"))
                        .build();
            }
        });
        return listAttendance;
    }

    public AttendanceView getRecordAttendanceById(int departmentId, String id) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("student_id", id);
        return namedJdbcTemplate.queryForObject("SELECT * FROM " + databaseName + ".attendance WHERE id = :id", parameters, new RowMapper<AttendanceView>() {
            @Override
            public AttendanceView mapRow(ResultSet rs, int rowNum) throws SQLException {
                return AttendanceView.builder()
                        .lessonId(rs.getInt("lesson_id"))
                        .studentId(rs.getString("student_id"))
                        .success(rs.getInt("success"))
                        .build();
            }
        });
    }

//    public void addNewRecordAttendance(int departmentId, AttendanceView attendanceView) {
//        if (departmentId > 15 || departmentId < 1) {
//            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
//        }
//
//        String databaseName = "DEP_" + departmentId;
//
//        List<Lesson> lessons = lessonRepository.getLessonsIdList(departmentId);
//        List<Integer> lessIds = lessons.stream().map(Lesson::getId).collect(Collectors.toList());
//
//        List<Student> students = studentRepository.getStudentsIdList(departmentId);
//        List<String> studIds = students.stream().map(Student::getStudentId).collect(Collectors.toList());
//
//
//        Map<String, Object> parameters = new HashMap<>();
//        for (int i = 0; i < lessIds.size(); i++) {
//            for (int j = 0; j < studIds.size(); j++) {
//                parameters.put("lesson_id", lessIds.get(i));
//                parameters.put("student_id", studIds.get(j));
//                parameters.put("success", attendanceView.getSuccess());
//            }
//
//            namedJdbcTemplate.update(
//                    "INSERT INTO " + databaseName + ".attendance (lesson_id,student_id,success)" +
//                            "VALUES (:lesson_id,:student_id,:success);",
//                    parameters);
//        }
//    }

    public void deleteRecordById(int departmentId, String studentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }

        String databaseName = "DEP_" + departmentId;

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("student_id", studentId);

        jdbcTemplate.update(
                "DELETE FROM " + databaseName + ".attendance WHERE student_id = :student_id ;");
    }

    public void updateRecordAttendance(int departmentId, AttendanceView attendanceView) {

    }
}
