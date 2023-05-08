package repository.mocks;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import project.model.Student;
import project.model.StudentView;
import project.repository.StudentRepository;

import javax.annotation.PostConstruct;
import java.util.List;


@RequiredArgsConstructor
public class StudentRepositoryMock implements StudentRepository {

    private final JdbcTemplate jdbcTemplate;

    private List<StudentView> students;

    @PostConstruct
    public void fullStudentsList() {
        String query = new StringBuilder()
                .append("SELECT student_id, subdepartment, name FROM DEP_")
                .append(1)
                .append(".Student_view")
                .append(" ORDER BY student_id ASC")
                .toString();
        students = jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(rs.getString("name"))
                        .build());
        System.out.println("students added: " + students);

    }

    @Override
    public StudentView getStudentById(int departmentId, String studentId) {
        try {
            return students.stream().filter(s -> s.getStudentId().equals(studentId)).findFirst().orElse(null);
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    @Override
    public StudentView addNewStudent(int departmentId, StudentView studentView) {
        return null;
    }

    @Override
    public List<StudentView> getStudentsView(int departmentID, Integer page, Integer pageSize) {
        return null;
    }


    @Override
    public void deleteStudentById(int departmentId, String studentId) {

    }

    @Override
    public void updateStudent(int departmentId, StudentView studentView) {

    }

    @Override
    public void addNewStudentByDepId(int departmentId, Student student) {

    }

    @Override
    public List<Student> getStudentsIdList(int departmentId) {
        return null;
    }

    @Override
    public Integer getStudentsCount(int departmentId) {
        return null;
    }
}
