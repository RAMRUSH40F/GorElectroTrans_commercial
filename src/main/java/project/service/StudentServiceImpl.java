package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import project.exceptions.InvalidSubdepartmentException;
import project.model.Student;
import project.repository.StudentJpaRepository;

import java.util.ArrayList;
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
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(student.getSubdepartmentName());
        }
        if (repository.existsById(student.getStudentId())) {
            throw new IllegalArgumentException("Рабочий с таким номером уже есть в базе.");
        }
        Student result = repository.save(createStudent(student, newSubDepartmentId));
        result.setSubdepartmentName(student.getSubdepartmentName());
        return result;

    }

    public @NonNull Page<Student> findAllWithPagination(List<List<String>> paramDirectionSortPair, int departmentId, @NonNull Integer page, @NonNull Integer size) {
        setCurrentDataSource("DEP_" + departmentId);
        List<Sort.Order> orders = new ArrayList<>();

        for (List<String> pair : paramDirectionSortPair) {
            orders.add(new Sort.Order(Sort.Direction.fromString(pair.get(1)), pair.get(0)));
        }

        Pageable paginatedRequest = PageRequest.of(page - 1, size, Sort.by(orders));
        Page<Student> studentPage = repository.findAll(paginatedRequest);

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
                .getId();
        if (newSubDepartmentId == null) {
            throw new InvalidSubdepartmentException(student.getSubdepartmentName());
        }
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
