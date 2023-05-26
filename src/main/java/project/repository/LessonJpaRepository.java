package project.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;
import project.model.Lesson;

import java.util.List;

@Repository
public interface LessonJpaRepository extends PagingAndSortingRepository<Lesson, Integer> {

    @Query("SELECT COUNT(id) FROM lesson AS COUNT")
    Integer getCount();

    @Query("select l from Lesson l " +
            "where l.topic like :key or l.teacher like :key or l.date = :key " +
            "order by l.date DESC")
    List<Lesson> findAllByKey(@Param("key") @Nullable String key);

    List<Lesson> findAllOrderByDateDesc(Pageable pageable);

    List<Lesson> findByIdOrderByDateDesc(@NonNull Integer id);




}

