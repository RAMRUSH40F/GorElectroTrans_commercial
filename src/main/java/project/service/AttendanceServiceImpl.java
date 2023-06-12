package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.stereotype.Service;
import project.exceptions.BoundedEntityNotFound;
import project.model.Attendance;
import project.model.AttendanceId;
import project.model.Lesson;
import project.model.Student;
import project.repository.AttendanceJpaRepository;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl {

    private final AttendanceJpaRepository repository;

    public Attendance save(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);

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

    public Page<Attendance> findAllByKeywordWithPagination(int departmentId, @Nullable String keyWord, Integer page, Integer pageSize) {
        setCurrentDataSource("DEP_" + departmentId);
        Page<Attendance> attendancePage;
        if (keyWord == null) {
            attendancePage = findAllWithPagination(departmentId, Integer.valueOf(page), Integer.valueOf(pageSize));
        } else {
            Pageable sortedByLessonIdPagination = PageRequest.of(page - 1, pageSize, Sort.by("lessonId").ascending());
            attendancePage = repository.findByKeyword(keyWord, sortedByLessonIdPagination);
        }
        return attendancePage;
    }


    public Page<Attendance> findAllWithPagination(int departmentId, Integer page, Integer pageSize) {
        setCurrentDataSource("DEP_" + departmentId);
        Pageable sortedByLessonIdPagination = PageRequest.of(page - 1, pageSize, Sort.by("lessonId").ascending());
        return repository.findAll(sortedByLessonIdPagination);
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
}
