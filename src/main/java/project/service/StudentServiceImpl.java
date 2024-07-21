package project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import project.exceptions.InvalidSubdepartmentException;
import project.model.Student;
import project.model.Subdepartment;
import project.model.projection.StudentIdName;
import project.repository.StudentJpaRepository;
import project.repository.projections.StudentIdNameJpaRepository;

import java.util.List;
import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl {

    private final StudentJpaRepository repository;
    private final StudentIdNameJpaRepository studentIdNameJpaRepository;
    private final SubdepartmentServiceImpl subdepartmentService;


    @NonNull
    public Student addNewStudentBySubdepartmentName(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Subdepartment studentsSubDepartment = subdepartmentService
                .findByName(departmentId, student.getSubdepartmentName())
                .orElseThrow(() -> new InvalidSubdepartmentException(student.getSubdepartmentName()));
        if (repository.existsById(student.getStudentId())) {
            throw new IllegalArgumentException("Рабочий с таким номером уже есть в базе.");
        }
        return repository.save(createStudent(student, studentsSubDepartment));

    }

    @NonNull
    public Page<Student> findAllWithPagination(int departmentId, Optional<String> key, Pageable pageable) {
        setCurrentDataSource("DEP_" + departmentId);
        // Пагинация с первой(для пользователя), с 0-ой для сервера.
        pageable = pageable.withPage(pageable.getPageNumber() - 1);
        if (key.isEmpty()) {
            return repository.findAll(pageable);
        }
        return repository.findAllByKey(key.get(), pageable);
    }

    /**
     * @param key   ключ для поиска по началу строки в поле student.name
     * @param limit макс.кол-во строк в выборке
     */
    @NonNull
    public List<StudentIdName> findByNameStartsWith(int departmentId, @NonNull String key, @Nullable Integer limit) {
        setCurrentDataSource("DEP_" + departmentId);
        PageRequest pageRequest = limit == null ? PageRequest.ofSize(999) : PageRequest.ofSize(limit);
        return studentIdNameJpaRepository.findByNameStartsWith(StringUtils.capitalize(key), pageRequest);
    }

    public void deleteStudentById(int departmentId, String studentId) {
        setCurrentDataSource("DEP_" + departmentId);
        repository.deleteById(studentId);
    }

    /**
     * Метод для смены отдела какого-то студента.
     */
    @NonNull
    public Student updateStudent(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        Subdepartment studentsSubDepartment = subdepartmentService
                .findByName(departmentId, student.getSubdepartmentName())
                .orElseThrow(() -> new InvalidSubdepartmentException(student.getSubdepartmentName()));
        return repository.save(createStudent(student, studentsSubDepartment));
    }

    @NonNull
    public Student addNewStudentByDepId(int departmentId, @NonNull Student student) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.save(student);
    }

    /**
     * Метод для внутреннего использования классами Multiplier.
     */
    @NonNull
    public List<Student> getStudentsIdList(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return (List<Student>) repository.findAll();
    }

    @NonNull
    public boolean getStudentExistsWithSubdepartmentId(int departmentId, @NonNull short subdepartmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.existsBySubdepartmentId(subdepartmentId);
    }

    @NonNull
    public static Student createStudent(Student student, @NonNull Subdepartment subdepartment) {
        return Student.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .subdepartmentId(subdepartment.getId())
                .subdepartment(subdepartment)
                .build();
    }
}
