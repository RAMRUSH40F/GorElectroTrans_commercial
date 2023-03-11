package project.repository.multiplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.model.Student;
import project.repository.StudentRepository;

import java.util.Random;

@Service("StudentMultiplierBean")
public class StudentMultiplier {
    @Autowired
    StudentRepository studentRepository;

    public void addAllStudents() {
        Random random = new Random();
        StringBuilder idBuilder = new StringBuilder();
        short departmentId;
        Student student;
        for (int i = 1; i < 16; i++) {
            for (int j = 0; j < 333; j++) {
                departmentId = (short) ((random.nextInt(6) + 1) * 100 + i);
                idBuilder.delete(0, 6);
                idBuilder.append(100000 + j + 333 * (i - 1))
                        .deleteCharAt(0);
                student = Student.builder()
                        .studentId(idBuilder.toString())
                        .subDepartmentId(departmentId)
                        .build();
                studentRepository.addNewStudentByDepId(i, student);
            }
        }
        System.out.println("Student Multiplier ended its work!!!");
    }
}
