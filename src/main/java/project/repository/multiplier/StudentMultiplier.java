package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Student;
import project.service.StudentService;

import java.util.List;
import java.util.Random;

@Service("StudentMultiplierBean")
@Lazy
@RequiredArgsConstructor
public class StudentMultiplier {
    private final StudentService studentService;

    public void addAllStudents(int departmentId) {

        List<String> randomNameList = List.of("Стремглав Вячеслав Игоревич", "Семен Иванович Дмитриевич", "Треуголова София Дмитриевна", "Рябичев Даниил Алексендрович", "Теска Кирилл Дмитриевич", "Трезубец Арина Дмитриевич", "Талец Данир Игоревич", "Иванов Семен Алексендрович", "Тодоренко Регина Алексендровна", "Бактяп Иван Алексендрович", "Ильюшина Мария Алексендровна", "Звонкович Николай Игоревич", "Жданович Артем Дмитриевич", "Скряпкин Сергей Алексендрович", "Карцева Катя Игоревна", "Трошин Никита Александрович", "Астон Михаил Дмитриевич", "Кудряшев Михаил Игоревич", "Москов Артем Алексендрович", "Король Артем Дмитриевич");

        Random randomizer = new Random();
        StringBuilder idBuilder = new StringBuilder();


        Student student;
        short SubdepartmentId;
        for (int secondN = 0; secondN < 5; secondN++) {
            for (int thirdN = 0; thirdN < 10; thirdN++) {
                for (int fourthN = 0; fourthN < 10; fourthN++) {
                    idBuilder.delete(0, 5);
                    idBuilder.append(0).append(secondN).append("3").append(thirdN).append(fourthN);
                    String studentName = randomNameList.get(randomizer.nextInt(20));
                    SubdepartmentId = (short) ((randomizer.nextInt(6) + 1));
                    student = Student.builder()
                            .name(studentName)
                            .studentId(idBuilder.toString())
                            .subDepartmentId(SubdepartmentId)
                            .build();
                    studentService.addNewStudentByDepId(departmentId, student);
                }
            }

        }
        System.out.printf("Student Multiplier ended work on %d department \n ", departmentId);
    }
}
