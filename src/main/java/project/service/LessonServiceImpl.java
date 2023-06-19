package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.repository.LessonJpaRepository;

import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@RequiredArgsConstructor
@Service
public class LessonServiceImpl {

    private final LessonJpaRepository lessonJpaRepository;


    public @NonNull Lesson addNewLesson(int department, Lesson lesson) {
        setCurrentDataSource("DEP_" + department);
        return lessonJpaRepository.save(lesson);
    }

    public @NonNull Lesson changeLesson(int department, Lesson modifiedLesson) {
        setCurrentDataSource("DEP_" + department);
        return lessonJpaRepository.save(modifiedLesson);
    }


    public @NonNull Page<Lesson> findAllByNullableKeywordWithPagination(int department, Optional<String> key, Pageable paginationParams) {
        setCurrentDataSource("DEP_" + department);
        paginationParams = paginationParams.withPage(paginationParams.getPageNumber() - 1);
        paginationParams.getSortOr(Sort.by(Sort.Direction.DESC, "date"));
        if (key.isEmpty()) {
            return lessonJpaRepository.findAll(paginationParams);
        }
        return lessonJpaRepository.findAllByKey(key.get(), paginationParams);
    }

    public void deleteLessonById(int department, int id) {
        setCurrentDataSource("DEP_" + department);
        lessonJpaRepository.deleteById(id);
    }

    public @NonNull Integer getLessonsCount(int department) {
        setCurrentDataSource("DEP_" + department);
        return lessonJpaRepository.countAllLessons();
    }


}
