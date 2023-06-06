package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import project.exceptions.InvalidSubdepartmentException;
import project.model.Student;
import project.repository.StudentJpaRepository;

import java.util.List;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service
@RequiredArgsConstructor
public class StudentServiceImpl {

    private final StudentJpaRepository repository;
    private final SubdepartmentServiceImpl subdepartmentService;


    public @NonNull Student addNewStudent(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Short newSubDepartmentId = subdepartmentService
                .getByName(departmentId, student.getSubDepartmentName())
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(student.getSubDepartmentName());
        }
        return repository.save(createStudent(student, newSubDepartmentId));

    }

    public @NonNull List<Student> findAllPaginated(int departmentId, @NonNull Integer page, @NonNull Integer size) {
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
    public @NonNull Student updateStudent(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Short newSubDepartmentId = subdepartmentService
                .getByName(departmentId, student.getSubDepartmentName())
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(student.getSubDepartmentName());
        }
        return repository.save(createStudent(student, newSubDepartmentId));
    }

    public @NonNull Student addNewStudentByDepId(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.save(student);
    }

    /**
     * Метод для внутреннего использование классов Multiplier.
     */
    public @NonNull List<Student> getStudentsIdList(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return (List<Student>) repository.findAll();
    }

    public @NonNull Integer getStudentsCount(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.countAllStudents();

    }

    public static @NonNull Student createStudent(Student student, @NonNull Short subDepartmentId) {
        return Student.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .subDepartmentId(subDepartmentId)
                .build();
    }
}