package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Student;
import project.repository.StudentRepository;

import java.util.Random;

@Service("StudentMultiplierBean")
@Lazy
@RequiredArgsConstructor
public class StudentMultiplier {
    private final StudentRepository studentRepository;

    public void addAllStudents(int departmentId) {
        Random random = new Random();
        StringBuilder idBuilder = new StringBuilder();
        short SubdepartmentId;
        Student student;

        for (int j = 0; j < 333; j++) {
            SubdepartmentId = (short) ((random.nextInt(6) + 1));
            idBuilder.delete(0, 6);
            idBuilder.append(100000 + j + 333 * (departmentId - 1))
                    .deleteCharAt(0);
            student = Student.builder()
                    .studentId(idBuilder.toString())
                    .subDepartmentId(SubdepartmentId)
                    .build();
            studentRepository.addNewStudentByDepId(departmentId, student);
        }

        System.out.printf("Student Multiplier ended work on %d department \n ", departmentId);
    }
}
