package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.exceptions.InvalidDepartmentException;
import project.model.Student;
import project.model.StudentView;

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

        namedParameterJdbcTemplate.update("INSERT INTO DEP_" + departmentID + ".student(student_id,subdepartment_id)"
                + "VALUE(:student_id,:subdepartment_id)", studentData);

    }

    public List<StudentView> getStudentsAdminView(int departmentID) {
        if (departmentID > 15 || departmentID < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }

        // rs = возвращаемый из .query объект типа ResultSet
        return jdbcTemplate.query("SELECT * FROM DEP_" + departmentID + ".Student_admin_view",
                (rs, rowNum) ->
                        StudentView.builder()
                                .studentId(rs.getString("student_id"))
                                .subDepartment(rs.getString("subdepartment"))
                                .fullName(rs.getString("name"))
                                .build());
    }


    // Название метода не конечное, он возращает StudentView без ФИО.
    // К ФИО должны иметь доступ лишь супер-админы.
    public List<StudentView> getStudentsView(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        return jdbcTemplate.query("SELECT * FROM DEP_" + departmentId + ".Student_view",
                (rs, rowNum) ->
                        StudentView.builder()
                                .studentId(rs.getString("student_id"))
                                .subDepartment(rs.getString("supdepartment"))
                                .fullName(null)
                                .build());
    }
}
