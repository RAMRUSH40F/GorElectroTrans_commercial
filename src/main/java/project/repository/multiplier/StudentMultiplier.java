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

    public void addNewStudent(int DatabaseId) {
        Random random = new Random();
        StringBuilder idBuilder = new StringBuilder();
        idBuilder.append(0);
        idBuilder.append(random.nextInt(5));
        for (int i = 0; i < 3; i++){
            idBuilder.append(random.nextInt(10));
        }
        short departmentId = (short) ((random.nextInt(6) + 1) * 100 + 1);
        Student student = Student.builder()
                .studentId(idBuilder.toString())
                .subDepartmentId(departmentId)
                .build();
        studentRepository.addNewStudent(DatabaseId, student);
    }
}
