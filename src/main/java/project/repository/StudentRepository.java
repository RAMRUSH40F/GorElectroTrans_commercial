package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Student;

import java.util.HashMap;
import java.util.Map;

@Repository
public class StudentRepository {
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
}
