package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.repository.LessonContentRepository;
import project.repository.LessonJpaRepository;

import java.util.List;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@RequiredArgsConstructor
@Service
public class LessonService {

    private final JdbcTemplate jdbcTemplate;

    private final LessonContentRepository lessonContentRepository;
    private final LessonJpaRepository lessonJpaRepository;


    public Lesson addNewLesson(int department, Lesson lesson) {
        setCurrentDataSource("DEP_" + department);
        return lessonJpaRepository.save(lesson);
    }

    public void changeLesson(int department, int id, Lesson changed_lesson) {
        setCurrentDataSource("DEP_" + department);
        lessonJpaRepository.save(changed_lesson);
    }

    public void deleteLessonById(int department, int id) {
        setCurrentDataSource("DEP_" + department);
        lessonJpaRepository.deleteById(id);
    }


    public Integer getLessonsCount(int department) {
        setCurrentDataSource("DEP_" + department);
        return lessonJpaRepository.getCount();
    }

    public List<Lesson> getLessonByKeyword(int department, String key) {
        setCurrentDataSource("DEP_" + department);
        List<Lesson> lessons = lessonJpaRepository.findAllByKey(key);

        for (Lesson x : lessons) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(department, x.getId()));
        }
        return lessons;
    }


    public List<Lesson> getPagedLessons(int department, int page, int size) {
        setCurrentDataSource("DEP_" + department);

        List<Lesson> lessonList = lessonJpaRepository.findAllOrderByDateDesc(PageRequest.of(page, size));

        for (Lesson x : lessonList) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(department, x.getId()));
        }
        return lessonList;
    }

    public List<Lesson> getLessonById(int department, int id) {
        setCurrentDataSource("DEP_" + department);
        List<Lesson> lessonList = lessonJpaRepository.findByIdOrderByDateDesc(id);

        for (Lesson x : lessonList) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(department, x.getId()));
        }
        return lessonList;
    }


    //MultiplierAttendance заменить на findALl просто.
    public List<Lesson> getLessonsIdList(int department) {
        setCurrentDataSource("DEP_" + department);
        String databaseName = "DEP_" + department;
        List<Lesson> lessonsIdList = jdbcTemplate.query("SELECT id FROM " +
                databaseName + ".lesson", (rs, rowNum) -> Lesson.builder()
                .id(rs.getInt("id"))
                .build());
        return lessonsIdList;
    }
}
