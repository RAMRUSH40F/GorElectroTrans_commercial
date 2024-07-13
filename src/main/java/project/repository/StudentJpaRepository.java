package project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import project.model.Student;

@Repository
public interface StudentJpaRepository extends PagingAndSortingRepository<Student, String> {
    @Query("select s from Student s " +
            "where s.name like CONCAT('%', :key, '%') " +
            "or s.studentId like CONCAT('%', :key, '%') " +
            "or s.subdepartment.name like CONCAT('%', :key, '%') "
    )
    Page<Student> findAllByKey(@Param("key") String key, Pageable pageable);

    boolean existsBySubdepartmentId(@NonNull Short subdepartmentId);
}
