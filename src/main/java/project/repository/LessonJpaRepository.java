package project.repository;

import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import project.model.Lesson;

import java.util.Date;
import java.util.Optional;

import static org.hibernate.loader.Loader.SELECT;

@Repository
public interface LessonJpaRepository extends PagingAndSortingRepository<Lesson, Integer> {


    @Query("select l from Lesson l " +
            "where l.topic like CONCAT('%', :key, '%') " +
            "or l.teacher like CONCAT('%', :key, '%') " +
            "or DATE_FORMAT(l.date, '%d.%m.%Y') like CONCAT('%', :key, '%') " +
            "order by l.date DESC")
    Page<Lesson> findAllByKey(@Param("key") @Nullable String key, Pageable pageable);

    @Query("SELECT COUNT(l) FROM Lesson l")
    Integer countAllLessons();
@Query("SELECT COUNT(l) FROM Lesson l WHERE l.date>=:dateFrom and l.date<:dateTo")
    Integer findAllLessonsBetweenDates(@Param("dateFrom") Date from,@Param("dateTo") Date to);
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.date>=:dateFrom and l.date<:dateTo and l.status='HELD' ")
    Integer findAllLessonsBetweenDatesWithHeld(@Param("dateFrom") Date from,@Param("dateTo") Date to);
    @Override
    Optional<Lesson> findById(@NonNull Integer integer);
}

