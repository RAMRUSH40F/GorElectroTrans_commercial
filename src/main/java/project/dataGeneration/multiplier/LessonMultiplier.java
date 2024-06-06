package project.dataGeneration.multiplier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.model.Lesson.Status;
import project.service.LessonServiceImpl;
import project.service.reportService.TeacherProfession;

import java.time.LocalDate;

@Service
@Lazy
@RequiredArgsConstructor
@Slf4j
public class LessonMultiplier {

    private static final Object[][] LESSONS_DATA = {
            {"Тех.обслуживание на новых моделях трамваев", 2.0f, "Джмун Федор Кириллович", 34, TeacherProfession.MASTER.getProfession()},
            {"Как вкручивать лампочки правильно", 1.6f, "Высоцкий Констанстин Павлович.", 10, TeacherProfession.RUKOVODITEL.getProfession()},
            {"Здоровый образ жизни у водителей трамваев", "Капылов Петр Дмитриевич.", 112, TeacherProfession.RUKOVODITEL.getProfession()},
            {"Разговоры о важном", 1.0f, "Высоцкий П.К.", 34, TeacherProfession.NASTAVNIK.getProfession()},
            {"Ремонт нового подвижного состава трамваев", 2.6f, "Левицкий Леонид Константинович.", 52, TeacherProfession.MASTER.getProfession()},
            {"Ремонт усов троллейбуса", 2.4f, "Яшин А.С.", 40, "Лучший механик месяца"}
    };
    private final LessonServiceImpl lessonService;

    public void addAllLessons(int departmentId) {
        log.info("Lesson multiplier starting adding testData: departmentDatabase={}", departmentId);
        for (int i = 0; i < 6; i++) {
            Status status = Status.values()[i % Status.values().length];
            boolean shouldHaveComment = status == Status.RESCHEDULED || status == Status.CANCELLED;
            String comment = shouldHaveComment ? "Some comment" : null;
            Lesson lesson = Lesson.builder()
                    .topic((String) LESSONS_DATA[i][0])
                    .duration((Float) LESSONS_DATA[i][1])
                    .date(LocalDate.now().minusDays(i))
                    .teacher((String) LESSONS_DATA[i][2])
                    .peoplePlanned((Integer) LESSONS_DATA[i][3])
                    .teacherPost((String) LESSONS_DATA[i][4])
                    .isHeld(false)
                    .status(status) // Different Statuses
                    .comment(comment)
                    .build();
            lessonService.addNewLesson(departmentId, lesson);
        }
        log.info("Lesson multiplier added testData: departmentDatabase={}", departmentId);

    }
}