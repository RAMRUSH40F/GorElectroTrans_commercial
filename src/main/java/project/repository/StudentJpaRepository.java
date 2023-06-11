package project.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import project.model.Student;

@Repository
public interface StudentJpaRepository extends PagingAndSortingRepository<Student, String> {

}
