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

    int departmentId = 1;

    @Autowired
    AttendanceRepository attendanceRepository;
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    StudentRepository studentRepository;


    public void addAllAttendance(){

        List<Lesson> lessons = lessonRepository.getLessonsId(departmentId);
        List<Integer> lessIds = lessons.stream().map(Lesson::getId).collect(Collectors.toList());

        List<Student> students = studentRepository.getStudentsId(departmentId);
        List<String> studIds = students.stream().map(Student::getStudentId).collect(Collectors.toList());

        Random random = new Random();

        for (int i = 0; i < lessIds.size(); i++) {
            for (int j = 0; j < studIds.size(); j++) {
                Attendance attendance = Attendance.builder()
                        .lessonId(lessIds.get(i))
                        .studentId(studIds.get(j))
                        .success(random.nextInt(2))
                        .build();
                attendanceRepository.addNewRecords(departmentId, attendance);
            }
        }

    }





}
