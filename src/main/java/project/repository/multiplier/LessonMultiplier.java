package project.repository.multiplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.repository.LessonRepository;

import java.sql.Date;

@Service("LessonMultiplierBean")
public class LessonMultiplier {

    @Autowired
    LessonRepository lessonRepository;

    public void addAllLessons(int departmentId){

        Object [] [] lessons = {
                {"Тех.обслуживание на новых моделях трамваев", 2.0f, new Date(1647748285L), "Джмун Ф.К.", 34},
                {"Как вкручивать лампочки правильно", 1.6f, new Date(1677508698105L), "Высоцкий П.К.", 10},
                {"Здоровый образ жизни у водителей трамваев", 2.6f, new Date(1647754134L), "Капылов П.К.", 112},
                {"Разговоры о важном", 1f, new Date(1649562685L), "Высоцкий П.К.", 34},
                {"Ремонт нового подвижного состава трамваев", 2.6f, new Date(1650772285L), "Левицкий Л.К.", 52},
                {"Ремонт усиков троллейбуса", 2.4f, new Date(1677508698105L), "Яшин А.С.", 40}
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
        System.out.printf("Lesson Multiplier ended work on %d department \n ", departmentId);

    }
}