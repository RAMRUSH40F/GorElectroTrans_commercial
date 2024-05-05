package project.multiplier.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.multiplier.AttendanceMultiplier;
import project.multiplier.LessonMultiplier;
import project.multiplier.StudentMultiplier;
import project.multiplier.SubdepartmentMultiplier;

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

    public void addAllTestData() {
        for (int i = 1; i <= DEPARTMENTS_COUNT; i++) {
            addTestData(i);
        }
    }

    /**
     * @param departmentNumber номер департамента для заполнения
     */
    public void addTestData(int departmentNumber) {
        subdepartmentMultiplier.addTestSubDepartments(departmentNumber);
        lessonMultiplier.addAllLessons(departmentNumber);
        studentMultiplier.addAllStudents(departmentNumber);
        attendanceMultiplier.addAllAttendance(departmentNumber);
    }
}
