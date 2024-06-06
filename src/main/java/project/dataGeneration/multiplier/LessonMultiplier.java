package project.dataGeneration.multiplier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.service.LessonServiceImpl;
import project.service.reportService.TeacherProfession;

import java.sql.Date;

@Service
@Lazy
@RequiredArgsConstructor
@Slf4j
public class LessonMultiplier {

    private static final Object[][] LESSONS_DATA = {
            {"Тех.обслуживание на новых моделях трамваев", 2.0f, new Date(1679846400L), "Джмун Федор Кириллович", 34, TeacherProfession.MASTER.getProfession()},
            {"Как вкручивать лампочки правильно", 1.6f, new Date(1680953600L), "Высоцкий Констанстин Павлович.", 10, TeacherProfession.RUKOVODITEL.getProfession()},
            {"Здоровый образ жизни у водителей трамваев", 2.6f, new Date(1981900800L), "Капылов Петр Дмитриевич.", 112, TeacherProfession.RUKOVODITEL.getProfession()},
            {"Разговоры о важном", 1f, new Date(2002457600L), "Высоцкий П.К.", 34, TeacherProfession.NASTAVNIK.getProfession()},
            {"Ремонт нового подвижного состава трамваев", 2.6f, new Date(2023014400L), "Левицкий Леонид Константинович.", 52, TeacherProfession.MASTER.getProfession()},
            {"Ремонт усов троллейбуса", 2.4f, new Date(2154041600L), "Яшин А.С.", 40, "Лучший механик месяца"}
    };
    private final LessonServiceImpl lessonService;

    public void addAllLessons(int departmentId) {
        log.info("Lesson multiplier starting adding testData: departmentDatabase={}", departmentId);
        for (int i = 0; i < 6; i++) {
            var status = Lesson.Status.values()[i % Lesson.Status.values().length];
            String comment = status == Lesson.Status.RESCHEDULED || status == Lesson.Status.CANCELLED ? "Some comment" : null;
            Lesson lesson = Lesson.builder()
                    .topic((String) LESSONS_DATA[i][0])
                    .duration((Float) LESSONS_DATA[i][1])
                    .date((Date) LESSONS_DATA[i][2])
                    .teacher((String) LESSONS_DATA[i][3])
                    .peoplePlanned((Integer) LESSONS_DATA[i][4])
                    .teacherPost((String) LESSONS_DATA[i][5])
                    .isHeld(false)
                    .status(status) // Different Statuses
                    .comment(comment)
                    .build();
            lessonService.addNewLesson(departmentId, lesson);
        }
        log.info("Lesson multiplier added testData: departmentDatabase={}", departmentId);

    }
}