package project.dataGeneration.multiplier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.model.Attendance;
import project.model.Lesson;
import project.model.Student;
import project.service.AttendanceServiceImpl;
import project.service.LessonServiceImpl;
import project.service.StudentServiceImpl;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;


@Service
@Lazy
@RequiredArgsConstructor
@Slf4j
public class AttendanceMultiplier {

    private final AttendanceServiceImpl attendanceService;
    private final LessonServiceImpl lessonService;
    private final StudentServiceImpl studentRepository;

    private final Random random = new Random();

    public void addAllAttendance(int departmentId) {
        log.info("Attendance multiplier starting adding testData: departmentDatabase={}", departmentId);

        Pageable pageable = PageRequest.of(1, 100);
        // Достаем из БД все записи об уроках
        List<Lesson> lessons = lessonService.findAllByNullableKeywordWithPagination(departmentId, Optional.empty(), pageable).toList();
        List<Integer> lessIds = lessons.stream()
                .map(Lesson::getId)
                .collect(Collectors.toList());
        log.debug("LessonId={}", lessIds);

        // Достаем из БД все записи об учениках и оставляем шестую часть записей
        List<Student> students = studentRepository.getStudentsIdList(departmentId);
        List<String> studentIdS = students.stream().
                map(Student::getStudentId).
                filter(id -> random.nextInt(6) == 1)
                .collect(Collectors.toList());
        log.debug("StudentId={}", studentIdS);

        for (String studId : studentIdS) {
            for (Integer lessId : lessIds) {
                Attendance attendance = Attendance.builder()
                        .lessonId(lessId)
                        .studentId(studId)
                        .success(random.nextInt(2))
                        .build();
                attendanceService.save(departmentId, attendance);
            }
        }
        log.debug("Attendance multiplier added testData: departmentDatabase={}", departmentId);
    }


}
