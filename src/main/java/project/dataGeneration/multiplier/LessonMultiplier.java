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
            {"Тех.обслуживание на новых моделях трамваев", "Джмун Федор Кириллович", TeacherProfession.MASTER.getProfession()},
            {"Как вкручивать лампочки правильно", "Высоцкий Констанстин Павлович.", TeacherProfession.RUKOVODITEL.getProfession()},
            {"Здоровый образ жизни у водителей трамваев", "Капылов Петр Дмитриевич.", TeacherProfession.RUKOVODITEL.getProfession()},
            {"Разговоры о важном", "Высоцкий П.К.", TeacherProfession.NASTAVNIK.getProfession()},
            {"Ремонт нового подвижного состава трамваев", "Левицкий Леонид Константинович.", TeacherProfession.MASTER.getProfession()},
            {"Ремонт усов троллейбуса", "Яшин А.С.", "Другое"}
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
                    .teacher((String) LESSONS_DATA[i][1])
                    .teacherPost((String) LESSONS_DATA[i][2])
                    .duration(0.5f * i)
                    .date(LocalDate.now().minusDays(i))
                    .peoplePlanned(i * 10)
                    .isHeld(false)
                    .status(status)
                    .comment(comment)
                    .build();
            lessonService.addNewLesson(departmentId, lesson);
        }
        log.info("Lesson multiplier added testData: departmentDatabase={}", departmentId);
    }
}