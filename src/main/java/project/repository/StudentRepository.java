package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Student;
import project.model.StudentView;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class StudentRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final SubdepartmentRepository subdepartmentRepository;


    public void addNewStudent(int departmentId, StudentView studentView) {
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

    public List<StudentView> getStudentsView(int departmentID) {
        String query = new StringBuilder()
                .append("SELECT student_id, subdepartment, name FROM DEP_")
                .append(departmentID)
                .append(".Student_view")
                .toString();
        // rs = возвращаемый из .query объект типа ResultSet
        return jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(rs.getString("name"))
                        .build());

    }

    public StudentView getStudentById(int departmentId, String studentId) {
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
        String query = new StringBuilder()
                .append("DELETE FROM DEP_")
                .append(departmentId)
                .append(".student WHERE student_id=")
                .append(studentId)
                .toString();
        jdbcTemplate.execute(query);

    }

    /**
     * Метод для смены отдела какого-то студента.
     */
    public void updateStudent(int departmentId, StudentView studentView) {
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

    public void addNewStudentByDepId(int departmentId, Student student) {
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("student_id", student.getStudentId());
        studentData.put("subdepartment_id", student.getSubDepartmentId());

        namedParameterJdbcTemplate.update("INSERT INTO DEP_" + departmentId + ".student(student_id,subdepartment_id)"
                + "VALUE(:student_id,:subdepartment_id)", studentData);

    }

    /**
     * Метод для внутреннего использование другой БД.
     */
    public List<Student> getStudentsIdList(int departmentId) {
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
