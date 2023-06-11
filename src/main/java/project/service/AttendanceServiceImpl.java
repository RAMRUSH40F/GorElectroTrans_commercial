package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Service;
import project.exceptions.BoundedEntityNotFound;
import project.model.Attendance;
import project.model.AttendanceId;
import project.model.Lesson;
import project.model.Student;
import project.repository.AttendanceJpaRepository;

import java.util.List;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl {

    private final AttendanceJpaRepository repository;

    public Attendance save(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);

        try {
            boundLessonAndStudentToAttendance(attendance);
            return repository.save(attendance);
        } catch (JpaObjectRetrievalFailureException e) {
            throw new BoundedEntityNotFound(e);
        }
    }

    private static void boundLessonAndStudentToAttendance(Attendance attendance) {
        Integer lessonId = attendance.getLessonId();
        String studentId = attendance.getStudentId();
        Lesson lesson = new Lesson();
        Student student = new Student();
        lesson.setId(lessonId);
        student.setStudentId(studentId);
        attendance.setLesson(lesson);
        attendance.setStudent(student);
    }

    public List<Attendance> findAllWithPagination(int departmentId, Integer page, Integer pageSize) {
        setCurrentDataSource("DEP_" + departmentId);
        Pageable sortedByDatePaginatedRequest = PageRequest.of(page - 1, pageSize, Sort.by("lesson_id").ascending());
        return repository.findAll(sortedByDatePaginatedRequest).toList();
    }

    public List<Attendance> findAllByKeyword(int departmentId, String key) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.getByKey(key);
    }

    public void updateEntity(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        repository.save(attendance);
    }

    public void deleteById(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        AttendanceId id = new AttendanceId(attendance.getLessonId(), attendance.getStudentId());
        repository.deleteById(id);
    }

    /**
     * @param departmentId
     * @return how many records are in database
     */
    public Integer getCount(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.countAll();
    }


}
