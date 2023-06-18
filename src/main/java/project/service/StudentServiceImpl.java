package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


    public @NonNull Student addNewStudentBySubdepartmentName(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Short newSubDepartmentId = subdepartmentService
                .findByName(departmentId, student.getSubdepartmentName())
                .orElseThrow(() -> new InvalidSubdepartmentException(student.getSubdepartmentName()))
                .getId();
        if (repository.existsById(student.getStudentId())) {
            throw new IllegalArgumentException("Рабочий с таким номером уже есть в базе.");
        }
        Student result = repository.save(createStudent(student, newSubDepartmentId));
        result.setSubdepartmentName(student.getSubdepartmentName());
        return result;

    }

    public @NonNull Page<Student> findAllWithPagination(int departmentId, Pageable pageable) {
        setCurrentDataSource("DEP_" + departmentId);
        Page<Student> studentPage = repository.findAll(pageable);
        for (Student s : studentPage.getContent()) {
            s.setSubdepartmentName(s.getSubdepartment().getName());
        }
        return studentPage;
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
                .findByName(departmentId, student.getSubdepartmentName())
                .orElseThrow(() -> new InvalidSubdepartmentException(student.getSubdepartmentName()))
                .getId();
        Student result = repository.save(createStudent(student, newSubDepartmentId));
        result.setSubdepartmentName(result.getSubdepartmentName());
        return result;
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


    public static @NonNull Student createStudent(Student student, @NonNull Short subDepartmentId) {
        return Student.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .subdepartmentId(subDepartmentId)
                .build();
    }
}
