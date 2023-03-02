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

    public void addNewStudent() {
        Random random = new Random();
        short departmentId = (short) ( (random.nextInt(6) + 1)*100+1);
        StringBuilder idBuilder=new StringBuilder();
        idBuilder.append(0).append(random.nextInt(5));
        for(int i=0;i<3;i++){
            idBuilder.append(random.nextInt(10));
        }
        Student student = Student.builder()
                .student_id(idBuilder.toString())
                .department_id(departmentId)
                .build();
        studentRepository.addNewStudent(1, student);
    }
}
