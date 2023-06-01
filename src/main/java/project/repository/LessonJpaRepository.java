package project.repository;

import lombok.NonNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import project.model.Lesson;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonJpaRepository extends PagingAndSortingRepository<Lesson, Integer> {

    @Query("SELECT COUNT(l) FROM Lesson l")
    Integer countAllLessons();

    @Query("select l from Lesson l " +
            "where l.topic like CONCAT('%', :key, '%') " +
            "or l.teacher like CONCAT('%', :key, '%') " +
            "or l.date like CONCAT('%', :key, '%') " +
            "order by l.date DESC")
    List<Lesson> findAllByKey(@Param("key") @Nullable String key);


    @Override
    Optional<Lesson> findById(@NonNull Integer integer);
}

