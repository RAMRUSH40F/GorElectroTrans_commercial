package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Student;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class StudentRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void addNewStudent(int departmentID, Student student) {
        if (departmentID > 15 || departmentID < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("student_id", student.getStudentId());
        studentData.put("subdepartment_id", student.getSubDepartmentId());
      /*  System.out.println(studentData.get("student_id"));
        System.out.println(studentData.get("subdepartment_id"));*/
        namedParameterJdbcTemplate.update("INSERT INTO DEP_" + departmentID + ".student(student_id,subdepartment_id)"
                + "VALUE(:student_id,:subdepartment_id)", studentData);

    }

    // Метод для внутреннего использование другой БД.
    public List<Student> getStudentsIdList(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;
        List<Student> studentIdList = jdbcTemplate.query("SELECT student_id FROM " +
                databaseName + ".student", new RowMapper<Student>() {
            @Override
            public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
                return Student.builder()
                        .studentId(rs.getString("student_id"))
                        .build();
            }
        });
        return studentIdList;
    }
}
