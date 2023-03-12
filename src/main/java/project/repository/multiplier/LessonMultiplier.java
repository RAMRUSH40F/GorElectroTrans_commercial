package project.repository.multiplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.repository.LessonRepository;

import java.sql.Date;

@Service("LessonMultiplierBean")
public class LessonMultiplier {

    int departmentId = 1;

    @Autowired
    LessonRepository lessonRepository;

    public void addAllLessons(){

        Object [] [] lessons = {
                {"Тех.обслуживание на новых моделях трамваев", 2.6f, new Date(1677508698105L), "Высоцкий П.К.", 34},
                {"Тех.обслуживание на новых моделях трамваев", 2.6f, new Date(1677508698105L), "Высоцкий П.К.", 34},
                {"Тех.обслуживание на новых моделях трамваев", 2.6f, new Date(1677508698105L), "Высоцкий П.К.", 34},
                {"Тех.обслуживание на новых моделях трамваев", 2.6f, new Date(1677508698105L), "Высоцкий П.К.", 34},
                {"Тех.обслуживание на новых моделях трамваев", 2.6f, new Date(1677508698105L), "Высоцкий П.К.", 34},
                {"Тех.обслуживание на новых моделях трамваев", 2.6f, new Date(1677508698105L), "Высоцкий П.К.", 34}
        };

        lessonRepository.deleteAllLessons(departmentId);

        for (int i = 0; i < 6; i++) {
            Lesson lesson = Lesson.builder()
                    .topic((String) lessons [i][0])
                    .duration((Float) lessons [i][1])
                    .date((Date) lessons [i][2])
                    .teacher((String) lessons [i][3])
                    .peoplePlanned((Integer) lessons [i][4])
                    .build();
            lessonRepository.addNewLesson(departmentId, lesson);
        }
    }
}