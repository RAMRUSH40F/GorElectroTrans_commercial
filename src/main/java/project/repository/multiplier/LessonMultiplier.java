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

    public void addOneLesson(){
        Lesson lesson = Lesson.builder()
                .topic("Тех.обслуживание на новых моделях трамваев")
                .duration(2.6f)
                .date(new Date(1677508698105L))
                .teacher("Высоцкий П.К.")
                .peoplePlanned(34)
                .build();
        lessonRepository.addNewLesson(1, lesson);
    }



}
