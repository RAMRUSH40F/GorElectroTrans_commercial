package project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import project.model.Attendance;
import project.model.AttendanceId;

@Repository
public interface AttendanceJpaRepository extends PagingAndSortingRepository<Attendance, AttendanceId> {

    @Query("select a from Attendance a " +
            "where a.lesson.date like CONCAT('%', :key, '%') " +
            "or a.lesson.topic like CONCAT('%', :key, '%') " +
            "or a.lesson.teacher like CONCAT('%', :key, '%') " +
            "or a.student.subdepartment.name like CONCAT('%', :key, '%') " +
            "or a.student.name like CONCAT('%', :key, '%') ")
    Page<Attendance> findByKeyword(@Param("key") @NonNull String key, Pageable pageable);

    Page<Attendance> findAll(Pageable pageable);
}
