package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Attendence;
import project.model.Lesson;
import project.model.Student;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Repository
public class AttendenceRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    NamedParameterJdbcTemplate namedJdbcTemplate;
    public void addNewSuccess(int departmentId, Attendence attendence) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }

        String databaseName = "DEP_" + departmentId;
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("lesson_id", attendence.getLessonId());
        parameters.put("student_id", attendence.getStudentId());
        parameters.put("success", attendence.getSuccess());

        namedJdbcTemplate.update(
                "INSERT INTO " + databaseName + ".lesson (lesson_id,student_id,success)" +
                        "VALUES (:lesson_id,:student_id,:success);",
                parameters);
    }
    public List<Lesson> getLessonsId(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;
        List<Lesson> lessonsId = jdbcTemplate.query("SELECT id FROM " + databaseName + ".lesson", new RowMapper<Lesson>() {
            @Override
            public Lesson mapRow(ResultSet rs, int rowNum) throws SQLException {
                return Lesson.builder()
                        .id(rs.getInt("id"))
                        .build();
            }
        });
        System.out.println(lessonsId);
        return lessonsId;
    }

    public List<Student> getStudentsId(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;
        List<Student> ListStudentId = jdbcTemplate.query("SELECT student_id FROM " + databaseName + ".student", new RowMapper<Student>() {
            @Override
            public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
                return Student.builder()
                        .studentId(rs.getString("student_id"))
                        .build();
            }
        });
        System.out.println(ListStudentId);
        return ListStudentId;
    }



}
