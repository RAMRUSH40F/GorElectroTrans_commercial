package project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.model.Student;

@Repository
public interface StudentJpaRepository extends PagingAndSortingRepository<Student, String> {
Page<Student> findAll(Sort sort, Pageable pageable);
}
