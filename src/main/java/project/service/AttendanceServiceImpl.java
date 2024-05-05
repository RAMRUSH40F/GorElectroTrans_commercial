package project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Service;
import project.exceptions.BoundedEntityNotFound;
import project.model.Attendance;
import project.model.AttendanceId;
import project.model.Lesson;
import project.model.Student;
import project.repository.AttendanceJpaRepository;

import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.getCurrentDataSource;
import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceServiceImpl {

    private final AttendanceJpaRepository repository;

    public @NonNull Attendance save(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        log.debug(getCurrentDataSource());
        try {
            boundLessonAndStudentToAttendance(attendance);
            AttendanceId attendanceId = new AttendanceId(attendance.getLessonId(), attendance.getStudentId());
            if (repository.existsById(attendanceId)) {
                throw new IllegalArgumentException("Посещаемость этого рабочего на этом уроке уже учтена.");
            }
            return repository.save(attendance);
        } catch (JpaObjectRetrievalFailureException e) {
            throw new BoundedEntityNotFound(e);
        }
    }

    public @NonNull Attendance updateEntity(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        boundLessonAndStudentToAttendance(attendance);
        return repository.save(attendance);
    }

    /**
     * В Spring Jpa пока не нашли способа на .save() метод
     * получать entity сразу с Join entity, поэтому
     * добавляем их в ручную
     *
     * @param attendance
     */
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

    public @NonNull Page<Attendance> findAllByKeywordWithPagination(int departmentId, Optional<String> keyWord, Pageable paginationParams) {
        setCurrentDataSource("DEP_" + departmentId);
        Page<Attendance> attendancePage;
        paginationParams = paginationParams.withPage(paginationParams.getPageNumber() - 1);
        paginationParams.getSortOr(Sort.by(Sort.Direction.ASC, "lessonId"));
        if (keyWord.isEmpty()) {
            attendancePage = repository.findAll(paginationParams);
        } else {
            attendancePage = repository.findByKeyword(keyWord.get(), paginationParams);
        }
        return attendancePage;
    }

    public void deleteById(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        AttendanceId id = new AttendanceId(attendance.getLessonId(), attendance.getStudentId());
        repository.deleteById(id);
    }
}
