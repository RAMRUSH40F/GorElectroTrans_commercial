package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import project.exceptions.InvalidSubdepartmentException;
import project.model.Student;
import project.repository.StudentJpaRepository;

import java.util.List;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentJpaRepository repository;
    private final SubdepartmentServiceImpl subdepartmentService;

    /**
     * @param student: studentId, studentName, departmentId
     * @logic: if studentName is null supposing that studentName
     * already exists in DB(WorkerRepository), then
     * if StudentName really exists we add successfully,
     * if not - we throw back an exception
     * if studentName is not null we add with editing current
     * data.
     */
    public Student addNewStudent(int departmentId, Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Short newSubDepartmentId = subdepartmentService
                .getByName(departmentId, student.getSubDepartmentName())
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(student.getSubDepartmentName());
        }
        return repository.save(createStudent(student, newSubDepartmentId));

    }

    public List<Student> findAllPaginated(int departmentId, Integer page, Integer size) {
        setCurrentDataSource("DEP_" + departmentId);
        Pageable paginatedRequest = PageRequest.of(page - 1, size, Sort.by("name").descending());
        return repository.findAll(paginatedRequest).toList();
    }

    // У рабочих общая на всю компанию таблица с рабочими.
    public void deleteStudentById(int departmentId, String studentId) {
        setCurrentDataSource("DEP_" + departmentId);
        repository.deleteById(studentId);
    }

    /**
     * Метод для смены отдела какого-то студента.
     */
    public Student updateStudent(int departmentId, Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Short newSubDepartmentId = subdepartmentService
                .getByName(departmentId, student.getSubDepartmentName())
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(student.getSubDepartmentName());
        }
        return repository.save(createStudent(student, newSubDepartmentId));
    }

    public Student addNewStudentByDepId(int departmentId, Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.save(student);
    }

    /**
     * Метод для внутреннего использование классов Multiplier.
     */
    public List<Student> getStudentsIdList(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return (List<Student>) repository.findAll();
    }

    public Integer getStudentsCount(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.countAllStudents();

    }

    public static Student createStudent(Student student, Short subDepartmentId) {
        return Student.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .subDepartmentId(subDepartmentId)
                .build();
    }
}
