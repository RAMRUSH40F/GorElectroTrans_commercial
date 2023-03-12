package project.repository.multiplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.model.Attendance;
import project.model.Lesson;
import project.model.Student;
import project.repository.AttendanceRepository;
import project.repository.LessonRepository;
import project.repository.StudentRepository;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;


@Service("AttendanceMultiplierBean")
public class AttendanceMultiplier {

    @Autowired
    AttendanceRepository attendanceRepository;
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    StudentRepository studentRepository;


    public void addAllAttendance(int departmentId) {
        // Достаем из БД все записи об уроках и об учениках.
        List<Lesson> lessons = lessonRepository.getLessonsIdList(departmentId);
        List<Integer> lessIds = lessons.stream().map(Lesson::getId).collect(Collectors.toList());

        List<Student> students = studentRepository.getStudentsIdList(departmentId);
        List<String> studIds = students.stream().map(Student::getStudentId).collect(Collectors.toList());

        Random random = new Random();

        for (int i = 0; i < lessIds.size(); i++) {
            for (int j = 0; j < studIds.size(); j++) {
                Attendance attendance = Attendance.builder()
                        .lessonId(lessIds.get(i))
                        .studentId(studIds.get(j))
                        .success(random.nextInt(2))
                        .build();
                attendanceRepository.addNewRecord(departmentId, attendance);
            }
        }

    }


}
