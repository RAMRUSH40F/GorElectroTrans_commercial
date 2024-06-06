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
    private static final int TEST_SUBDEPARTMENT_COUNT = 6;
    private final StudentServiceImpl studentService;

    private final Random randomizer = new Random();

    public void addAllStudents(int departmentId) {
        log.info("Student multiplier starting adding testData: departmentDatabase={}", departmentId);
        StringBuilder idBuilder = new StringBuilder(5);

        for (int secondDigit = 0; secondDigit < 5; secondDigit++) {
            for (int thirdDigit = 0; thirdDigit < 5; thirdDigit++) {
                for (int fourthDigit = 5; fourthDigit < 10; fourthDigit++) {
                    idBuilder.delete(0, 5);
                    idBuilder.append('0').append(secondDigit).append(thirdDigit).append(fourthDigit).append('9');
                    String studentName = RANDOM_NAME_LIST.get(randomizer.nextInt(RANDOM_NAME_LIST.size()));
                    int subdepartmentId = randomizer.nextInt(TEST_SUBDEPARTMENT_COUNT) + 1;
                    studentService.addNewStudentByDepId(subdepartmentId, Student.builder()
                            .name(studentName)
                            .studentId(idBuilder.toString())
                            .subdepartmentId((short) subdepartmentId)
                            .build());
                }
            }
        }
        log.info("Student multiplier ended work: departmentDatabase={}", departmentId);
    }
}
