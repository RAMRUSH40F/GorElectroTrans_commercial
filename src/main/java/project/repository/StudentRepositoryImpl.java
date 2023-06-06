package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.exceptions.InvalidStudentIdException;
import project.exceptions.InvalidSubdepartmentException;
import project.exceptions.Validator;
import project.model.Student;
import project.model.StudentView;
import project.model.Worker;
import project.service.SubdepartmentServiceImpl;
import project.service.WorkerService;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository("StudentRepositoryBean")
@RequiredArgsConstructor
public class StudentRepositoryImpl implements StudentRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final SubdepartmentServiceImpl subdepartmentService;
    private final WorkerService workerService;


    /**
     * @param studentView: studentId, studentName, departmentId
     * @logic: if studentName is null supposing that studentName
     * already exists in DB(WorkerRepository), then
     * if StudentName really exists we add successfully,
     * if not - we throw back an exception
     * if studentName is not null we add with editing current
     * data.
     */
    @Override
    public StudentView addNewStudent(int departmentId, StudentView studentView) {
        Validator.validateStudentId(studentView.getStudentId());
        if (studentView.getFullName() == null) {
            Optional<Worker> worker = workerService.getWorkerById(studentView.getStudentId());
            if (worker.isEmpty()) {
                throw new InvalidStudentIdException("",
                        "Информации о работнике с таким табельным номером еще нет в системе. " +
                                "Повторите запрос, введя Фамилию и инициалы рабочего");
            }
            studentView.setFullName(worker.get().getName());
        } else {
            try {
                workerService.addNewWorker(
                        Worker.builder()
                                .id(studentView.getStudentId())
                                .name(studentView.getFullName())
                                .build());
            } catch (DataIntegrityViolationException exception) {
                if (exception.getMessage().contains("Duplicate")) {
                    throw new IllegalArgumentException("Рабочий с таким номером уже есть в системе");
                } else {
                    throw new RuntimeException(exception);
                }

            }
        }
        // Для добавления нужен SubDepartmentId, а с фронта приходит SubDepartmentName
        Short newSubDepartmentId = subdepartmentService
                .getByName(departmentId, studentView.getSubDepartment())
                .getId();
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("studentId", studentView.getStudentId());
        studentData.put("subdepartmentId", newSubDepartmentId);

        String INSERT_STUDENT_TEMPLATE = new StringBuilder()
                .append("INSERT INTO DEP_")
                .append(departmentId)
                .append(".student(student_id,subdepartment_id)")
                .append("VALUE(:studentId,:subdepartmentId)")
                .toString();
        namedParameterJdbcTemplate.update(INSERT_STUDENT_TEMPLATE, studentData);
        return studentView;
    }

    @Override
    public List<StudentView> getStudentsView(int departmentID, Integer page, Integer pageSize) {
        String query = new StringBuilder()
                .append("SELECT student_id, subdepartment, name FROM DEP_")
                .append(departmentID)
                .append(".Student_view")
                .append(" ORDER BY student_id ASC LIMIT ")
                .append((page - 1) * pageSize)
                .append(",")
                .append(pageSize)
                .toString();
        return jdbcTemplate.query(query, (rs, rowNum) ->
                StudentView.builder()
                        .studentId(rs.getString("student_id"))
                        .subDepartment(rs.getString("subdepartment"))
                        .fullName(rs.getString("name"))
                        .build());

    }


    @Override
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
    @Override
    public void updateStudent(int departmentId, StudentView studentView) {
        Short newSubDepartmentId = subdepartmentService
                .getByName(departmentId, studentView.getSubDepartment())
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(studentView.getSubDepartment());
        }
        String query = new StringBuilder()
                .append("UPDATE DEP_")
                .append(departmentId)
                .append(".student SET subdepartment_id=")
                .append(newSubDepartmentId)
                .append(" WHERE student_id='")
                .append(studentView.getStudentId())
                .append("'")
                .toString();

        String query2 = new StringBuilder()
                .append("UPDATE WORKERS.workers SET name='")
                .append(studentView.getFullName())
                .append("' WHERE id='")
                .append(studentView.getStudentId())
                .append("'")
                .toString();
        jdbcTemplate.execute(query);
        jdbcTemplate.execute(query2);
    }

    @Override
    public void addNewStudentByDepId(int departmentId, Student student) {
        Map<String, Object> studentData = new HashMap<>();
        studentData.put("studentId", student.getStudentId());
        studentData.put("subdepartment_id", student.getSubDepartmentId());

        namedParameterJdbcTemplate.update("INSERT INTO DEP_" + departmentId + ".student(student_id,subdepartment_id)"
                + "VALUE(:studentId,:subdepartment_id)", studentData);

    }

    /**
     * Метод для внутреннего использование другой БД.
     */
    @Override
    public List<Student> getStudentsIdList(int departmentId) {
        String databaseName = "DEP_" + departmentId;
        List<Student> studentIdList = jdbcTemplate.query("SELECT student_id FROM " +
                databaseName + ".student", new RowMapper<Student>() {
            @Override
            public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
                return Student.builder()
                        .studentId(rs.getString("student_Id"))
                        .build();
            }
        });
        return studentIdList;
    }

    @Override
    public Integer getStudentsCount(int departmentId) {
        String databaseName = "DEP_" + departmentId;
        return jdbcTemplate.queryForObject("SELECT COUNT(student_id) FROM " +
                databaseName + ".student AS COUNT", Integer.class);

    }

}
