package project.dataGeneration.multiplier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Student;
import project.service.StudentServiceImpl;

import java.util.List;
import java.util.Random;

@Service
@Lazy
@RequiredArgsConstructor
@Slf4j
public class StudentMultiplier {
    private static final List<String> RANDOM_NAME_LIST = List.of("Стремглав Вячеслав Игоревич", "Семен Иванович Дмитриевич", "Треуголова София Дмитриевна", "Рябичев Даниил Алексендрович", "Теска Кирилл Дмитриевич", "Трезубец Арина Дмитриевич", "Талец Данир Игоревич", "Иванов Семен Алексендрович", "Тодоренко Регина Алексендровна", "Бактяп Иван Алексендрович", "Ильюшина Мария Алексендровна", "Звонкович Николай Игоревич", "Жданович Артем Дмитриевич", "Скряпкин Сергей Алексендрович", "Карцева Катя Игоревна", "Трошин Никита Александрович", "Астон Михаил Дмитриевич", "Кудряшев Михаил Игоревич", "Москов Артем Алексендрович", "Король Артем Дмитриевич");
    private final StudentServiceImpl studentService;

    private final Random randomizer = new Random();

    public void addAllStudents(int departmentId) {
        log.info("Student multiplier starting adding testData: departmentDatabase={}", departmentId);
        StringBuilder idBuilder = new StringBuilder();

        Student student;
        short SubdepartmentId;
        for (int secondN = 0; secondN < 5; secondN++) {
            for (int thirdN = 0; thirdN < 10; thirdN++) {
                for (int fourthN = 0; fourthN < 10; fourthN++) {
                    idBuilder.delete(0, 5);
                    idBuilder.append(0).append(secondN).append("3").append(thirdN).append(fourthN);
                    String studentName = RANDOM_NAME_LIST.get(randomizer.nextInt(20));
                    SubdepartmentId = (short) (randomizer.nextInt(6) + 1);
                    student = Student.builder()
                            .name(studentName)
                            .studentId(idBuilder.toString())
                            .subdepartmentId(SubdepartmentId)
                            .build();
                    studentService.addNewStudentByDepId(departmentId, student);
                }
            }

        }
        log.info("Student multiplier ended work: departmentDatabase={}", departmentId);
    }
}
