package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.repository.LessonContentRepository;
import project.repository.LessonJpaRepository;

import java.util.List;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@RequiredArgsConstructor
@Service
public class LessonService {

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
        return lessonJpaRepository.countAllLessons();
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

        Pageable sortedByDatePaginatedRequest = PageRequest.of(page - 1, size, Sort.by("date").descending());
        List<Lesson> lessonList = lessonJpaRepository.findAll(sortedByDatePaginatedRequest).toList();

        for (Lesson x : lessonList) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(department, x.getId()));
        }
        return lessonList;
    }

}
