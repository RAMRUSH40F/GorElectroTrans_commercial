package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import project.model.Lesson;
import project.repository.LessonJpaRepository;

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


    public @NonNull Page<Lesson> findAllByNullableKeywordWithPagination(int department, @Nullable String key, int page, int size) {
        setCurrentDataSource("DEP_" + department);
        Pageable sortedByDatePaginatedRequest = PageRequest.of(page - 1, size, Sort.by("date").descending());
        if (key == null) {
            return findAllWithPagination(department, page, size);
        }
        return lessonJpaRepository.findAllByKey(key, sortedByDatePaginatedRequest);
    }


    public @NonNull Page<Lesson> findAllWithPagination(int department, int page, int size) {
        setCurrentDataSource("DEP_" + department);
        Pageable sortedByDatePaginatedRequest = PageRequest.of(page - 1, size, Sort.by("date").descending());
        return lessonJpaRepository.findAll(sortedByDatePaginatedRequest);
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
