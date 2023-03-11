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

    @Autowired
    SubdepartmentRepository subdepartmentRepository;

    public void addNewStudent(int departmentId, StudentView studentView) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        // Для добавления нужен SubDepartmentId, а с фронта приходит SubDepartmentName
        Short newSubDepartmentId = subdepartmentRepository
                .getSubdepartmentByName(departmentId, studentView.getSubDepartment())
                .getId();
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("student_id", studentView.getStudentId());
        studentData.put("subdepartment_id", newSubDepartmentId);

        String insertQueryWithParameters = new StringBuilder()
                .append("INSERT INTO DEP_")
                .append(departmentId)
                .append(".student(student_id,subdepartment_id)")
                .append("VALUE(:student_id,:subdepartment_id)")
                .toString();
        namedParameterJdbcTemplate.update(insertQueryWithParameters, studentData);

    }

    public List<StudentView> getStudentsAdminView(int departmentID) {
        if (departmentID > 15 || departmentID < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        String query = new StringBuilder()
                .append("SELECT student_id, subdepartment, name FROM DEP_")
                .append(departmentID)
                .append(".Student_admin_view")
                .toString();
        // rs = возвращаемый из .query объект типа ResultSet
        return jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(rs.getString("name"))
                        .build());

    }


    // *К ФИО должны иметь доступ лишь супер-админы. Возращает StudentView без ФИО.
    public List<StudentView> getStudentsView(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        String query = new StringBuilder()
                .append("SELECT student_id, subdepartment, name FROM DEP_")
                .append(departmentId)
                .append(".Student_admin_view")
                .toString();

        // rs = возвращаемый из .query объект типа ResultSet
        return jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(rs.getString(null))
                        .build());
    }


    public StudentView getStudentById(int departmentId, String studentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        String query = new StringBuilder()
                .append("SELECT * FROM DEP_")
                .append(departmentId)
                .append(".Student_view WHERE student_id=")
                .append(studentId)
                .toString();
        return jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(null)
                        .build()).get(0);
    }

    public StudentView getStudentByIdAdmin(int departmentId, String studentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        String query = new StringBuilder()
                .append("SELECT * FROM DEP_")
                .append(departmentId)
                .append(".Student_view WHERE student_id=")
                .append(studentId)
                .toString();
        return jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(rs.getString("name"))
                        .build()).get(0);
    }

    public void deleteStudentById(int departmentId, String studentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        String query = new StringBuilder()
                .append("DELETE FROM DEP_")
                .append(departmentId)
                .append(".student WHERE student_id=")
                .append(studentId)
                .toString();
        jdbcTemplate.execute(query);

    }

    // Метод для смены отдела какого-то студента.
    public void updateStudent(int departmentId, StudentView studentView) {
        if (departmentId > 15 || departmentId < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        Short newSubDepartmentId = subdepartmentRepository
                .getSubdepartmentByName(departmentId, studentView.getSubDepartment())
                .getId();

        String query = new StringBuilder()
                .append("UPDATE DEP_")
                .append(departmentId)
                .append(".student SET subdepartment_id=")
                .append(newSubDepartmentId)
                .append(" WHERE student_id='")
                .append(studentView.getStudentId())
                .append("'")
                .toString();

        jdbcTemplate.execute(query);
    }

    // Этот метод добавляет студента, используя номер департамента.
    public void addNewStudentByDepId(int departmentId, Student student) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }

        Map<String, Object> studentData = new HashMap<>();
        studentData.put("student_id", student.getStudentId());
        studentData.put("subdepartment_id", student.getSubDepartmentId());

        namedParameterJdbcTemplate.update("INSERT INTO DEP_" + departmentId + ".student(student_id,subdepartment_id)"
                + "VALUE(:student_id,:subdepartment_id)", studentData);

    }

}
