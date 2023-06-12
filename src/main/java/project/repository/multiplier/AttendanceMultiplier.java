package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Attendance;
import project.model.Lesson;
import project.model.Student;
import project.repository.AttendanceRepository;
import project.service.LessonServiceImpl;
import project.service.StudentServiceImpl;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;


@Service("AttendanceMultiplierBean")
@Lazy
@RequiredArgsConstructor
public class AttendanceMultiplier {

    private final AttendanceRepository attendanceRepository;
    private final LessonServiceImpl lessonService;
    private final StudentServiceImpl studentRepository;


    public void addAllAttendance(int departmentId) {

        Random random = new Random();

        // Достаем из БД все записи об уроках и об учениках и оставляем каждый шестой id студента.
        List<Lesson> lessons = lessonService.findAllWithPagination(departmentId,1,99).toList();
        List<Integer> lessIds = lessons.stream()
                .map(Lesson::getId)
                .filter(id -> random.nextInt(6) == 1)
                .collect(Collectors.toList());
        System.out.println(lessIds);

        // Достаем из БД все записи об уроках и об учениках и оставляем каждый 3ий урок.
        List<Student> students = studentRepository.getStudentsIdList(departmentId);
        List<String> studentIdS = students.stream().
                map(Student::getStudentId).
                filter(id -> random.nextInt(3) == 1)
                .collect(Collectors.toList());
        System.out.println(studentIdS);

        // Каждый шестой в среднем ходит на какие-то уроки
        for (String studId : studentIdS) {
            // Ходят в среднем на каждый третий урок.
            for (Integer lessId : lessIds) {
                Attendance attendance = Attendance.builder()
                        .lessonId(lessId)
                        .studentId(studId)
                        .success(random.nextInt(2))
                        .build();
                attendanceRepository.addNewRecord(departmentId, attendance);
            }
        }
        System.out.printf("Attendance multiplier ended work on %d department \n", departmentId);
    }


}
