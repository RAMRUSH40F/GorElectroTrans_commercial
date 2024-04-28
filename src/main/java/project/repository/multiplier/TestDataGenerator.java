package project.repository.multiplier;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 * Сервис для заполнения базы тестовыми данными
 *
 * @author Ramil Rahimkulov
 * @since 29.04.2024
 */
@Service
@Lazy
@Slf4j
public class TestDataGenerator {
    public static final int DEPARTMENTS_COUNT = 15;
    @Autowired
    AttendanceMultiplier attendanceMultiplier;
    @Autowired
    LessonMultiplier lessonMultiplier;
    @Autowired
    StudentMultiplier studentMultiplier;
    @Autowired
    SubdepartmentMultiplier subdepartmentMultiplier;

    public void addTestData() {
        addTestData(DEPARTMENTS_COUNT);
    }

    /**
     * @param numberOfDepartments до какой базы включительно заполнить данными, начиная с DEP_1
     */
    public void addTestData(int numberOfDepartments) {
        subdepartmentMultiplier.addAllSubDepartments();
        for (int i = 1; i <= numberOfDepartments; i++) {
            lessonMultiplier.addAllLessons(i);
            studentMultiplier.addAllStudents(i);
            attendanceMultiplier.addAllAttendance(i);
        }
    }
}
